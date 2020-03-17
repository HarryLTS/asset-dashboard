from django.apps import AppConfig
from schedule import Scheduler
import threading
import time
import sys
sys.path.insert(1, './../secret.py')
from secret import *
from .field_status import *
from urllib.parse import urlencode
import requests
import json
import datetime
from django.utils.timezone import get_current_timezone

def run_continuously(self, interval=1):
    """Continuously run, while executing pending jobs at each elapsed
    time interval.
    @return cease_continuous_run: threading.Event which can be set to
    cease continuous run.
    Please note that it is *intended behavior that run_continuously()
    does not run missed jobs*. For example, if you've registered a job
    that should run every minute and you set a continuous run interval
    of one hour then your job won't be run 60 times at each interval but
    only once.
    """

    cease_continuous_run = threading.Event()

    class ScheduleThread(threading.Thread):

        @classmethod
        def run(cls):
            while not cease_continuous_run.is_set():
                self.run_pending()
                time.sleep(interval)

    continuous_thread = ScheduleThread()
    continuous_thread.setDaemon(True)
    continuous_thread.start()
    return cease_continuous_run


Scheduler.run_continuously = run_continuously

SECONDS_IN_DAY = 60 * 60

def start_scheduler():
    from .models import Stock, User, CashEditLog, CashFlow
    def update_cash_flows():
        for user in User.objects.all():
            for cash_flow in user.cash_flows.all():
                now = datetime.datetime.now(tz=get_current_timezone());
                delta = (now - cash_flow.last_invoked).total_seconds()
                interval = cash_flow.frequency * SECONDS_IN_DAY
                while delta > interval:
                    cash_flow.last_invoked = cash_flow.last_invoked + datetime.timedelta(seconds=interval)
                    edit_log = CashEditLog(value=cash_flow.value, description=cash_flow.title + " Automatic", time_created=now)
                    edit_log.save()
                    user.cash_edit_logs.add(edit_log)
                    user.cash_amount = user.cash_amount + cash_flow.value
                    print(user.cash_amount)
                    print(cash_flow.value)
                    delta = (now - cash_flow.last_invoked).total_seconds()
                    print(cash_flow.title, delta, interval)
                cash_flow.save()
            user.save()

    def update():
        update_cash_flows()

        def update_stock_name(stock):
            request_url = FINNHUB_PROFILE_URL + '?' + urlencode({
                'symbol': stock.symbol,
                'token': FINNHUB_API_KEY
            })
            payload = {}
            headers = {}

            response = requests.request("GET", request_url, headers=headers, data=payload)

            try:
                data = json.loads(response.text.encode('utf8'))
                if 'name' in data:
                    stock.name_status = FIELD_VALID
                    stock.name = data['name']
                else:
                    stock.name_status = FIELD_INVALID

            except json.decoder.JSONDecodeError:
                stock.name_status = FIELD_UNSETTLED

            stock.save()

        def update_stock_quote(stock):
            request_url = FINNHUB_QUOTE_URL + '?' + urlencode({
                'symbol': stock.symbol,
                'token': FINNHUB_API_KEY
            })
            payload = {}
            headers = {}

            response = requests.request("GET", request_url, headers=headers, data=payload)

            try:
                data = json.loads(response.text.encode('utf8'))

                if bool(data) and data['c'] != 0:  # checks if dict is not empty
                    stock.quote_status = FIELD_VALID
                    stock.quote = json.dumps(data)
                else:
                    stock.quote_status = FIELD_INVALID

            except json.decoder.JSONDecodeError:
                stock.quote_status = FIELD_UNSETTLED
            stock.save()

        stocks = Stock.objects.order_by("-last_updated")
        fields_changed = 0
        for stock in stocks:
            if stock.name_status == FIELD_UNSETTLED:
                update_stock_name(stock)
                fields_changed += 1
            if stock.quote_status == FIELD_UNSETTLED:
                update_stock_quote(stock)
                fields_changed += 1
        print('Updated at {}. Fields changed: {}'.format(datetime.datetime.now(tz=get_current_timezone()), fields_changed))

    scheduler = Scheduler()
    scheduler.every(1).minutes.do(update)
    scheduler.run_continuously()


class AuthappConfig(AppConfig):
    name = 'authapp'

    def ready(self):
        start_scheduler()
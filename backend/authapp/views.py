from django.shortcuts import render
from .models import *
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from .field_status import *
import json
import datetime
from django.utils.timezone import get_current_timezone

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def stock_view(request, *args, **kwargs):
    def get_user_stock_data(request):
        user_stock_quantity_map = json.loads(request.user.stock_quantity_map)
        stock_data = {
            'data_by_symbol': {},
            'stock_combined_value': 0
        }

        for symbol, quantity in user_stock_quantity_map.items():
            stock = Stock.objects.filter(symbol=symbol).first()
            if not stock:
                stock_data['data_by_symbol'][symbol] = {
                    'quote_status': FIELD_UNSETTLED,
                    'name_status': FIELD_UNSETTLED
                }
            else:
                quote = json.loads(stock.quote)
                stock_data['data_by_symbol'][symbol] = {
                    'quote_status': stock.quote_status,
                    'name_status': stock.name_status,
                    'name': stock.name,
                    'quote': quote,
                    'quantity': quantity
                }
                if stock.quote_status == FIELD_VALID:
                    stock_data['stock_combined_value'] += quote['c'] * quantity

        data = {
            'stock_data': stock_data
        }
        return Response(data, status=status.HTTP_200_OK)

    def remove_user_stock(request, symbol):
        user_stock_quantity_map = json.loads(request.user.stock_quantity_map)

        if symbol not in user_stock_quantity_map:
            return Response("Bad symbol", status=status.HTTP_400_BAD_REQUEST)

        del user_stock_quantity_map[symbol]
        request.user.stock_quantity_map = json.dumps(user_stock_quantity_map)
        request.user.save()

        return Response("Good", status=status.HTTP_200_OK)

    def update_user_stock(request, symbol, unconfirmed_quantity, allow_existing):
        stock = Stock.objects.filter(symbol=symbol).first()

        if stock and stock.quote_status == FIELD_INVALID:
            return Response("Bad symbol", status=status.HTTP_400_BAD_REQUEST)
        elif not stock:
            new_stock = Stock(symbol=symbol)
            new_stock.save()

        user_stock_quantity_map = json.loads(request.user.stock_quantity_map)

        if not allow_existing and symbol in user_stock_quantity_map:
            return Response("Existing symbol", status=status.HTTP_400_BAD_REQUEST)

        try:
            quantity = int(unconfirmed_quantity)
        except (TypeError, ValueError):
            return Response("Bad quantity", status=status.HTTP_400_BAD_REQUEST)

        user_stock_quantity_map[symbol] = quantity

        request.user.stock_quantity_map = json.dumps(user_stock_quantity_map)
        request.user.save()
        return Response("Good", status=status.HTTP_200_OK)

    if request.method == 'GET':
        return get_user_stock_data(request)
    else:
        command = request.META.get('HTTP_STOCKCOMMAND')
        symbol = request.META.get('HTTP_STOCKSYMBOL')
        quantity = request.META.get('HTTP_STOCKQUANTITY')

        if command == 'add':
            return update_user_stock(request, symbol, quantity, allow_existing=False)
        elif command == 'edit':
            return update_user_stock(request, symbol, quantity, allow_existing=True)
        elif command == 'remove':
            return remove_user_stock(request, symbol)

        return Response("Bad command", status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def cash_view(request, *args, **kwargs):
    if request.method == 'GET':
        data = {
            'cash_flows': {},
            'cash_amount': request.user.cash_amount
        }

        for cash_flow in request.user.cash_flows.all():
            data['cash_flows'][cash_flow.id] = {
                'title': cash_flow.title,
                'value': cash_flow.value,
                'frequency': cash_flow.frequency,
                'last_invoked': "{} {}, {}".format(cash_flow.last_invoked.strftime("%B"), cash_flow.last_invoked.day, cash_flow.last_invoked.year),
                'total_value_accrued': cash_flow.total_value_accrued
            }

        return Response(data, status=status.HTTP_200_OK)
    else:
        def remove_cash_flow():
            cash_flow = request.user.cash_flows.filter(id=flow_id).first()
            if not cash_flow:
                return Response("Bad id", status=status.HTTP_400_BAD_REQUEST)
            request.user.cash_flows.remove(cash_flow)

            return Response("Good", status=status.HTTP_200_OK)

        def add_cash_flow():
            cash_flow = CashFlow(title=title, value=value, frequency=frequency, last_invoked=datetime.datetime.now(tz=get_current_timezone()))
            cash_flow.save()

            request.user.cash_flows.add(cash_flow)
            return Response("Good", status=status.HTTP_200_OK)

        def edit_cash_flow():
            cash_flow = request.user.cash_flows.filter(id=flow_id).first()
            if not cash_flow:
                return Response("Bad id", status=status.HTTP_400_BAD_REQUEST)

            cash_flow.title = title
            cash_flow.value = value
            cash_flow.frequency = frequency
            cash_flow.save()
            return Response("Good", status=status.HTTP_200_OK)

        command = request.META.get('HTTP_CASHFLOWCOMMAND')
        title = request.META.get('HTTP_CASHFLOWTITLE')
        value = request.META.get('HTTP_CASHFLOWVALUE')
        frequency = request.META.get('HTTP_CASHFLOWFREQUENCY')
        flow_id = request.META.get('HTTP_CASHFLOWID')

        if command == 'add' or command == 'edit':
            try:
                value = float(value)
            except (ValueError, TypeError):
                return Response("Bad value", status=status.HTTP_400_BAD_REQUEST)

        if command == 'add':
            return add_cash_flow()
        elif command == 'edit':
            return edit_cash_flow()
        elif command == 'remove':
            return remove_cash_flow()

        return Response("Bad command", status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def edit_log_view(request, *args, **kwargs):
    if request.method == 'GET':
        data = {
            'edit_logs': {}
        }
        for edit_log in request.user.cash_edit_logs.order_by('-time_created')[:10]:
            data['edit_logs'][edit_log.id] = {
                'time_created': "{} {}, {}".format(edit_log.time_created.strftime("%B"), edit_log.time_created.day,
                                                   edit_log.time_created.year),
                'value': edit_log.value,
                'description': edit_log.description
            }
        return Response(data, status=status.HTTP_200_OK)
    else:
        def remove_edit_log():
            edit_log = request.user.cash_edit_logs.filter(id=edit_log_id).first()

            if not edit_log:
                return Response("Bad id", status=status.HTTP_400_BAD_REQUEST)

            request.user.cash_edit_logs.remove(edit_log)

            return Response("Good", status=status.HTTP_200_OK)

        def add_edit_log():
            edit_log = CashEditLog(value=value, description=description, time_created=datetime.datetime.now(tz=get_current_timezone()))
            edit_log.save()

            request.user.cash_edit_logs.add(edit_log)
            request.user.cash_amount = request.user.cash_amount + value

            request.user.save()

            return Response("Good", status=status.HTTP_200_OK)


        command = request.META.get('HTTP_EDITLOGCOMMAND')
        value = request.META.get('HTTP_EDITLOGVALUE')
        description = request.META.get('HTTP_EDITLOGDESCRIPTION')
        edit_log_id = request.META.get('HTTP_EDITLOGID')


        if command == 'add':
            try:
                value = float(value)
            except (ValueError, TypeError):
                return Response("Bad value", status=status.HTTP_400_BAD_REQUEST)

            return add_edit_log()
        elif command == 'remove':
            return remove_edit_log()

        return Response("Bad command", status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def estate_view(request, *args, **kwargs):
    if request.method == 'GET':
        estate_data = {
            'estate_list': {},
            'total_estate_value': 0
        }

        for estate in request.user.estate_address_list.all():
            estate_data['estate_list'][estate.id] = {
                'address': estate.address,
                'value': estate.value,
                'is_primary_residence': estate.is_primary_residence
            }
            estate_data['total_estate_value'] += estate.value


        data = {
            'estate_data': estate_data
        }
        return Response(data, status=status.HTTP_200_OK)
    else:
        def add_estate():
            estate = Estate(address=address, value=value, is_primary_residence=is_primary_residence)
            estate.save()
            request.user.estate_address_list.add(estate)
            return Response("Good", status=status.HTTP_200_OK)

        def edit_estate():
            estate = request.user.estate_address_list.filter(id=estate_id).first()
            if not estate:
                return Response("Bad id", status=status.HTTP_400_BAD_REQUEST)
            estate.address = address
            estate.value = value
            estate.is_primary_residence = is_primary_residence
            estate.save()
            return Response("Good", status=status.HTTP_200_OK)

        def remove_estate():
            estate = request.user.estate_address_list.filter(id=estate_id).first()
            if not estate:
                return Response("Bad id", status=status.HTTP_400_BAD_REQUEST)

            request.user.estate_address_list.remove(estate)

            return Response("Good", status=status.HTTP_200_OK)

        command = request.META.get('HTTP_ESTATECOMMAND')
        address = request.META.get('HTTP_ESTATEADDRESS')
        value = request.META.get('HTTP_ESTATEVALUE')
        is_primary_residence = False if request.META.get('HTTP_ESTATEIPR') == "false" else True
        estate_id = request.META.get('HTTP_ESTATEID')

        if command == 'add' or command == 'edit':
            try:
                value = float(value)
            except (ValueError, TypeError):
                return Response("Bad value", status=status.HTTP_400_BAD_REQUEST)


        if command == 'add':
            return add_estate()
        elif command == 'edit':
            return edit_estate()
        elif command == 'remove':
            return remove_estate()

        return Response("Bad command", status=status.HTTP_400_BAD_REQUEST)


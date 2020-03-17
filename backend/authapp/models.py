from django.db import models
from django.contrib.auth.models import AbstractUser
from .field_status import *
# Create your models here.

class CashFlow(models.Model):
    last_invoked = models.DateTimeField()
    value = models.FloatField()
    frequency = models.IntegerField()
    title = models.CharField(max_length=255)
    total_value_accrued = models.FloatField(default=0)


class CashEditLog(models.Model):
    time_created = models.DateTimeField()
    value = models.FloatField()
    description = models.CharField(max_length=255)


class Estate(models.Model):
    is_primary_residence = models.BooleanField(default=False)
    address = models.CharField(max_length=255)
    value = models.FloatField(default=0)


class User(AbstractUser):
    email = models.EmailField(verbose_name='email', max_length=255, unique=True)

    stock_quantity_map = models.TextField(default='{}')
    # structure: { SYMBOL: QUANTITY, }
    estate_address_list = models.ManyToManyField(Estate)
    cash_edit_logs = models.ManyToManyField(CashEditLog)
    cash_flows = models.ManyToManyField(CashFlow)
    cash_amount = models.FloatField(default=0)

    REQUIRED_FIELDS = ['username']
    USERNAME_FIELD = 'email'

    def get_username(self):
        return self.email


class Stock(models.Model):
    symbol = models.CharField(max_length=5, primary_key=True)
    last_updated = models.DateTimeField(auto_now=True)

    name = models.CharField(default='No data', max_length=255)
    name_status = models.CharField(default=FIELD_UNSETTLED, max_length=255)
    quote = models.TextField(default='{}')
    # structure: FinnHub quote JSON response
    quote_status = models.CharField(default=FIELD_UNSETTLED, max_length=255)



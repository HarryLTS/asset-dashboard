from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class User(AbstractUser):
    email = models.EmailField(verbose_name='email', max_length=255, unique=True)

    stock_data = models.TextField(default='{}')
    estate_data = models.TextField(default='{}')
    cash_data = models.TextField(default='{}')

    def get_username(self):
        return self.email
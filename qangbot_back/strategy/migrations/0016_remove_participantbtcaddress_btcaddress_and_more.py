# Generated by Django 5.0.3 on 2024-05-31 12:21

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('strategy', '0015_transaction_delete_payment'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RemoveField(
            model_name='participantbtcaddress',
            name='btcAddress',
        ),
        migrations.RemoveField(
            model_name='participant',
            name='baseAssetValues',
        ),
        migrations.AddField(
            model_name='participantbtcaddress',
            name='address',
            field=models.CharField(blank=True, max_length=100, unique=True),
        ),
        migrations.AlterField(
            model_name='participantbtcaddress',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='ParticipantBTCAddresses', to=settings.AUTH_USER_MODEL),
        ),
        migrations.RemoveField(
            model_name='transaction',
            name='assetValue',
        ),
        migrations.DeleteModel(
            name='BTCAddress',
        ),
        migrations.AddField(
            model_name='transaction',
            name='assetValue',
            field=models.ManyToManyField(related_name='Transactions', to='strategy.assetvalue'),
        ),
    ]

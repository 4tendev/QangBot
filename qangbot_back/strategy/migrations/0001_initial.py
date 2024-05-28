# Generated by Django 5.0.3 on 2024-05-27 15:56

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='Asset',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('strSymbol', models.CharField(max_length=10)),
            ],
        ),
        migrations.CreateModel(
            name='CoinexFutureAccount',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True)),
                ('access_ID', models.CharField(max_length=200)),
                ('secret_key', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Account',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('account_id', models.IntegerField()),
                ('account_model', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='Accounts', to='contenttypes.contenttype')),
            ],
        ),
        migrations.CreateModel(
            name='AssetValue',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.FloatField()),
                ('asset', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='Values', to='strategy.asset')),
            ],
        ),
        migrations.CreateModel(
            name='Strategy',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('accounts', models.ManyToManyField(to='strategy.account')),
                ('baseAssetValues', models.ManyToManyField(related_name='Strategies', to='strategy.assetvalue')),
                ('currentAssetValues', models.ManyToManyField(to='strategy.assetvalue')),
            ],
        ),
    ]
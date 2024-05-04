# Generated by Django 5.0.3 on 2024-05-01 15:43

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='CoinexAccount',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('access_ID', models.CharField(max_length=50)),
                ('secret_key', models.CharField(max_length=100)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='CoinexAccounts', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Exchange',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('account_model', models.OneToOneField(default=1, on_delete=django.db.models.deletion.PROTECT, to='contenttypes.contenttype')),
            ],
        ),
        migrations.CreateModel(
            name='Contract',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('url', models.URLField()),
                ('apiIdentifier', models.CharField(max_length=50)),
                ('exchange', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='Contracts', to='gridbot.exchange')),
            ],
        ),
        migrations.CreateModel(
            name='GridBot',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('status', models.BooleanField(default=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('lastTrueCheck', models.DateTimeField(null=True)),
                ('interval', models.IntegerField(default=60)),
                ('account_id', models.IntegerField()),
                ('account_model', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='GridBots', to='contenttypes.contenttype')),
                ('contract', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='GridBots', to='gridbot.contract')),
            ],
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('exactCreationtResponse', models.TextField(unique=True)),
                ('orderID', models.CharField(max_length=50)),
                ('executed', models.BooleanField(blank=True, null=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('contract', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='Orders', to='gridbot.contract')),
            ],
        ),
        migrations.CreateModel(
            name='Grid',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sell', models.FloatField()),
                ('buy', models.FloatField()),
                ('size', models.FloatField()),
                ('nextPosition', models.IntegerField(choices=[(1, 'sell'), (2, 'buy')])),
                ('status', models.IntegerField(choices=[(0, 'start'), (1, 'open'), (2, 'filled'), (3, 'pause')])),
                ('is_active', models.BooleanField(default=True)),
                ('bot', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='Grids', to='gridbot.gridbot')),
                ('order', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='Grids', to='gridbot.order')),
                ('orders', models.ManyToManyField(blank=True, to='gridbot.order')),
            ],
        ),
    ]

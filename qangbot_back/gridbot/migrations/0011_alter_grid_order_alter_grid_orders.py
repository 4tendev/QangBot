# Generated by Django 5.0.3 on 2024-05-24 10:54

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gridbot', '0010_alter_grid_orders'),
    ]

    operations = [
        migrations.AlterField(
            model_name='grid',
            name='order',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='grid', to='gridbot.order'),
        ),
        migrations.AlterField(
            model_name='grid',
            name='orders',
            field=models.ManyToManyField(blank=True, related_name='Grids', to='gridbot.order'),
        ),
    ]
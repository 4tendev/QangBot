# Generated by Django 5.0.3 on 2024-05-24 10:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gridbot', '0009_alter_grid_orders'),
    ]

    operations = [
        migrations.AlterField(
            model_name='grid',
            name='orders',
            field=models.ManyToManyField(blank=True, to='gridbot.order'),
        ),
    ]
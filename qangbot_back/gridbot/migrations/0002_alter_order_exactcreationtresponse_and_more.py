# Generated by Django 4.2.13 on 2024-06-13 11:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gridbot', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='exactCreationtResponse',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='order',
            name='orderID',
            field=models.CharField(max_length=255, unique=True),
        ),
    ]

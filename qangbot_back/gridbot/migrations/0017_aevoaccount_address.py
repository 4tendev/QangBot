# Generated by Django 4.2.13 on 2024-06-11 13:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gridbot', '0016_aevoaccount_delete_lyraaccount'),
    ]

    operations = [
        migrations.AddField(
            model_name='aevoaccount',
            name='address',
            field=models.CharField(default='', max_length=200),
            preserve_default=False,
        ),
    ]

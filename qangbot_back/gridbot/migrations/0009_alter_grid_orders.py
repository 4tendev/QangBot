# Generated by Django 5.0.3 on 2024-05-22 17:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gridbot', '0008_rename_bot_grid_gridbot_remove_gridbot_lasttruecheck'),
    ]

    operations = [
        migrations.AlterField(
            model_name='grid',
            name='orders',
            field=models.ManyToManyField(blank=True, related_name='grid', to='gridbot.order'),
        ),
    ]

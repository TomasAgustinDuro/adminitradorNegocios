# Generated by Django 5.1 on 2024-08-20 00:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('diarios', '0002_alter_diariovendido_valor'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='inventario',
            name='numero_identificador',
        ),
        migrations.AddField(
            model_name='inventario',
            name='restante',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='inventario',
            name='stock',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='inventario',
            name='vendido',
            field=models.IntegerField(default=0),
        ),
    ]

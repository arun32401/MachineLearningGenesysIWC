# Generated by Django 2.2.7 on 2019-11-07 12:56

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Oldperson',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('SERIALNO', models.CharField(max_length=100)),
                ('SPORDER', models.CharField(max_length=100)),
                ('PUMA', models.CharField(max_length=100)),
                ('ST', models.CharField(max_length=100)),
                ('PWGTP', models.CharField(max_length=100)),
                ('AGEP', models.CharField(max_length=100)),
            ],
        ),
    ]
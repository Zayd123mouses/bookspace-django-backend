# Generated by Django 4.1.1 on 2022-09-24 18:21

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='BooksAdded',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('book_title', models.TextField(default='No title')),
                ('book_state', models.TextField(default='No title')),
                ('book_id', models.TextField(default='0000')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='booksToRead', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user_id', 'book_title')},
            },
        ),
    ]

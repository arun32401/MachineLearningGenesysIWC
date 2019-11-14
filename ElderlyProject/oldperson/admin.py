from django.contrib import admin
from oldperson.models import Oldperson
from django.contrib.admin.options import ModelAdmin
# Register your models here.

class OldpersonAdmin(ModelAdmin):
    list_display =["SERIALNO", "PUMA", "ST", "PWGTP"]
#     search_fields = ["SERIALNO"]
#     list_filter=["ST"]
#     
admin.site.register(Oldperson, OldpersonAdmin)


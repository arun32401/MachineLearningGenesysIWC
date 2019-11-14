from django.contrib import admin
from disabledperson.models import Disabledperson
from django.contrib.admin.options import ModelAdmin

# Register your models here.
class DisabledpersonAdmin(ModelAdmin):
    list_display =["ST", "PUMA", "AGEP"]
#     search_fields = ["PUMA"]
    list_filter=["ST"]
    list_filter=["SEX"]
#     
admin.site.register(Disabledperson, DisabledpersonAdmin)
# admin.site.register(Disabledperson)
'''
Created on 06-Nov-2019

@author: achauhan
'''
from disabledperson.models import Disabledperson
from rest_framework import serializers

class DisabledpersonSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Disabledperson
        fields = "__all__"
        
    
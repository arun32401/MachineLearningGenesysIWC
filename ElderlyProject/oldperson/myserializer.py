'''
Created on 06-Nov-2019

@author: achauhan
'''
from oldperson.models import Oldperson
from rest_framework import serializers

class OldpersonSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Oldperson
        fields = "__all__"
        
    
from rest_framework import viewsets
from oldperson.models import Oldperson
from oldperson.myserializer import OldpersonSerializer

# Create your views here.
# def home(req):
#     return HttpResponse("Hi Arun")

class OldpersonViewSet(viewsets.ModelViewSet):
    queryset = Oldperson.objects.all()
    serializer_class = OldpersonSerializer

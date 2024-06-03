from django.core.management.base import BaseCommand
import time
from user.models import VIPBTCAddress
import csv
def createBTCAddress():
  
    try :
        csv_file_path = 'user/BTCAddress.csv'
        payment_addresses = []
        with open(csv_file_path, mode='r') as file:
            csv_reader = csv.DictReader(file)
            for row in csv_reader:
                payment_addresses.append(row['Payment Address'])
            print(payment_addresses)
            for address in payment_addresses :
                VIPBTCAddress.objects.get_or_create(address=address)
    except : 
        pass
    

class Command(BaseCommand):
    def handle(self, *args, **options):
        time.sleep(5)
        try:
            createBTCAddress()
            for vipAddress in VIPBTCAddress.objects.filter(
                    paid=False).exclude(user__isnull=True):
                vipAddress.checkPaid()
                print(vipAddress)
                time.sleep(5)
        except Exception as e:
            print(e)
        print("OK STRATEGT script")

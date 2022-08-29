from accounts.models import Account, Customer
from rest_framework import serializers


class RegistrationSerializer(serializers.ModelSerializer):

    password2 = serializers.CharField(
        style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = Account
        fields = ['email', 'username', 'full_name',
                  'password', 'password2']
        extra_kwargs = {'password': {'write_only': True}}

    def save(self):
        account = Account(
            email=self.validated_data['email'],
            username=self.validated_data['username'],
            full_name=self.validated_data['full_name'],
            is_staff=True,
            is_admin = True
        )
        password = self.validated_data['password']
        password2 = self.validated_data['password2']

        if password != password2:
            raise serializers.ValidationError(
                {'password': 'Passwords must match'})
        account.set_password(password)
        account.save()
        return account
class CustomerRegistrationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Customer
        fields = ['type',
                  'id','company_name','address','phone','address','country','city']
        extra_kwargs = {'password': {'write_only': True}}
    def save(self,data):
        customer = Customer(
         
            id=self.validated_data['id'],
            company_name=self.validated_data['company_name'],
            address=self.validated_data['address'],
            phone=self.validated_data['phone'],
            country=self.validated_data['country'],
            city=self.validated_data['city'],
            type=self.validated_data['type'],
        )
        print(data['email'])
        account = Account(
            email=data['email'],
            username=data['company_name'],
            full_name=data['company_name'],
            customer_detail=customer,
        )
        password = data['password']
        password2 = data['password2']

        if password != password2:
            raise serializers.ValidationError(
                {'password': 'Passwords must match'})
        account.set_password(password)
        customer.save()
        account.save()
        customer.customer_data=account
        customer.save()
        return account

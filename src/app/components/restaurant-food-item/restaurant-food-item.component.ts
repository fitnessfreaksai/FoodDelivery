import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FoodService } from 'src/app/service/food.service';

@Component({
  selector: 'app-restaurant-food-item',
  templateUrl: './restaurant-food-item.component.html',
  styleUrls: ['./restaurant-food-item.component.css']
})
export class RestaurantFoodItemComponent {

  restaurantId:number=0;
  categoryId:number=0;
  foodItemList:any[]=[];
  loggedUseData:any;
  cartItems:any[]=[];
  totalAmount:number=0;
  deliveryAddress:string='';

  constructor(private activatedRoute:ActivatedRoute, private foodService:FoodService){
    this.activatedRoute.params.subscribe((res:any)=>{
      this.categoryId = res.categoryId;
      this.restaurantId = res.restaurantId;
      this.GetFoodItemOfRestaurantByCategory();
      const localData = localStorage.getItem('zomato_user');
      if(localData !== null){
      this.loggedUseData = JSON.parse(localData);
    }
      this.GetCartItemsByCustomerIdForRestaurant();
    })
  }
  GetFoodItemOfRestaurantByCategory(){
    this.foodService.GetFoodItemOfRestaurantByCategory(this.restaurantId, this.categoryId).subscribe((res:any)=>{
      this.foodItemList = res.data;
    })
  }
  GetCartItemsByCustomerIdForRestaurant(){
    this.foodService.GetCartItemsByCustomerIdForRestaurant(this.loggedUseData.userId, this.restaurantId).subscribe((res:any)=>{
      this.cartItems = res.data;
      this.cartItems.forEach(element =>{
        this.totalAmount = this.totalAmount + element.price;
      })
    })
  }
  onOrder(){
    const obj = {
      "userId": this.loggedUseData.userId,
      "totalAmount": this.totalAmount,
      "restaurantId": this.restaurantId,
      "deliveryAddress": this.deliveryAddress
    };
    this.foodService.placeOrder(obj).subscribe((Res:any)=>{
      if(Res.result){
        alert('order has place successfully');
        this.GetCartItemsByCustomerIdForRestaurant();
        this.deliveryAddress = '';
        this.totalAmount = 0;
      }else{
        alert(Res.message)
      }
    })
  }
  addtocart(itemID:number){
    const localData = localStorage.getItem('zomato_user');
    if(localData==null){
      alert('please login')
    }else{
      this.loggedUseData = JSON.parse(localData)
      const obj = {
        "customerId": this.loggedUseData.userId,
        "itemId": itemID,
        "quantity": 1
      };
      this.foodService.addtocart(obj).subscribe((Res:any)=>{
        if(Res.result){
          alert(Res.message);
          this.GetCartItemsByCustomerIdForRestaurant();
        }else{
          alert(Res.message)
        }
      })
    }
  }
}




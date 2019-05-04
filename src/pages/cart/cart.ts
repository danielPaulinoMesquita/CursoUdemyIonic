import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CarItem } from '../../models/car-item';
import { ProdutoService } from '../../services/domain/produto.service';
import { API_CONFIG } from '../../config/api.config';
import { CartService } from '../../services/domain/cart.service';


@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

items: CarItem[];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public produtoService: ProdutoService,
    public cartService: CartService) {
  }

  ionViewDidLoad() {
      let cart= this.cartService.getCart();
      this.items=cart.itens;
      this.loadImageUrls();
  }

  loadImageUrls(){
    for(let i=0; i<this.items.length; i++){
        let item=this.items[i];
        this.produtoService.getSmallImageFromBucket(item.produto.id)
        .subscribe(response=>{
                item.produto.imageUrl=`${API_CONFIG.bucketBaseUrl}/prod${item.produto.id}-small.jpg`;
         },error=>{});
     }
  }

}

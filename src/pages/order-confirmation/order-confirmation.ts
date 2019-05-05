import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PedidoDTO } from '../../models/pedido.dto';
import { CarItem } from '../../models/car-item';
import { CartService } from '../../services/domain/cart.service';
import { ClienteDTO } from '../../models/cliente.dto';
import { EnderecoDTO } from '../../models/endereco.dto';
import { ClienteService } from '../../services/domain/cliente.service';

/**
 * Generated class for the OrderConfirmationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-confirmation',
  templateUrl: 'order-confirmation.html',
})
export class OrderConfirmationPage {

  pedido: PedidoDTO;
  cartItems: CarItem[];
  cliente: ClienteDTO;
  endereco: EnderecoDTO;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public cartService: CartService,
    public clienteService: ClienteService) {

    this.pedido=this.navParams.get('pedido')
  }

  ionViewDidLoad() {
    this.cartItems= this.cartService.getCart().itens;
    this.clienteService.findById(this.pedido.cliente.id).subscribe(response=>{
      this.cliente= response as ClienteDTO;
      this.endereco= this.findEndereco(this.pedido.enderecoDeEntrega.id, response['enderecos']);
    },error=>{
      this.navCtrl.setRoot("HomePage")
    });
  }

  findEndereco(id:string, list: EnderecoDTO[]): EnderecoDTO{
    let position= list.findIndex(x=>x.id==id);
    return list[position];
  }

  total(){
    return this.cartService.total();
  }

}

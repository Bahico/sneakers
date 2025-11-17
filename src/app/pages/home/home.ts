import {Component} from '@angular/core';
import { Banner } from "./components/banner/banner";

@Component({
  templateUrl: 'home.html',
  selector: 'home',
  imports: [Banner],
})
export default class Home {

}

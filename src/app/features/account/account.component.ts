import { Component } from '@angular/core';
import { HeadersComponent } from "../../shared/components/headers/headers.component";
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";

@Component({
  selector: 'app-account',
  imports: [HeadersComponent, SidebarComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {

}

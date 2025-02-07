import { inject, Injectable } from "@angular/core";
import { AppConstant } from "../constants/constant";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Account } from "../../shared/models/account.model";
import { ResponseResult } from "../../shared/models/response.model";

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    private readonly API_URL = AppConstant.URL + "account";
    private http = inject(HttpClient);

    getAccountInfor() : Observable<ResponseResult<Account>> {
        return this.http.get<ResponseResult<Account>>(this.API_URL + "/detail");
    }
}
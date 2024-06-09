package com.nft.market.nftmarketbackend.pojo.vo;

import lombok.Data;

@Data
public class Result <T>{
    private T data;
    private int code;
    private String msg;
    public static <T> Result<T> ok(T data) {
        Result<T> result = new Result<>();
        result.setData(data);
        result.setCode(200); // 200 表示成功，你可以根据需要修改状态码
        result.setMsg("Success");
        return result;
    }

    public static <T> Result<T> ok() {
        Result<T> result = new Result<>();
        result.setCode(200); // 200 表示成功，你可以根据需要修改状态码
        result.setMsg("Success");
        return result;
    }

    public static <T> Result<T> fail(int code, String msg) {
        Result<T> result = new Result<>();
        result.setData(null);
        result.setCode(code);
        result.setMsg(msg);
        return result;
    }

}

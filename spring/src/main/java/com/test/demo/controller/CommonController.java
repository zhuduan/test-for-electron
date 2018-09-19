package com.test.demo.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;


@RestController()
@RequestMapping(value = "1")
public class CommonController {

    @RequestMapping(value = "index", method = RequestMethod.GET)
    public Object index() {
        return "only a test";
    }

    @RequestMapping(value = "hello", method = RequestMethod.GET)
    public Object hello() {
        return "hello";
    }
}

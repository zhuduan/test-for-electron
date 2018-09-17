import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {NzMessageService} from "ng-zorro-antd";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'test-basic-list-test',
  templateUrl: './basic-list-test.component.html',
})
export class TestBasicListTestComponent implements OnInit {
  form: FormGroup;
  submitting = false;

  q: any = {
    status: 'all'
  };
  loading = false;
  data: any[] = [];

  constructor(private http: _HttpClient, private fb: FormBuilder, public msg: NzMessageService) { }

  ngOnInit() {
    this.form = this.fb.group({
      targetUrl: [null, [Validators.required]]
    });

    this.getData();
  }

  getData() {
    this.loading = true;
    this.http.get('/api/list', {count: 10}).subscribe((res: any) => {
      this.data = res;
      this.loading = false;

      // setInterval(() => {this.clock2()},1000);
      // this.download();
    })
  }

  clock2() {
    this.data[0].percent = Number.parseFloat('1.1') + this.data[0].percent + 1;
  }

  download() {
    let targetUrl = 'https://www.youtube.com/watch?v=LXK-7FAHNIY';
    let evtSource = new EventSource('http://localhost:7001/youtube/download2?targetUrl=' + targetUrl);
    // [download]   0.0% of 72.76MiB at 13.51KiB/s ETA 01:31:54
    evtSource.onmessage = (event) => {
      let respData = event.data.toString();
      console.log(respData);
      if (respData === 'download_complete' || respData === 'download_error') {
        evtSource.close();
      }

      let beginKey = '[download]';
      let endKey = '% of ';
      if (!respData.includes(beginKey)) {
        return;
      }
      if (!respData.includes(endKey)) {
        return;
      }
      let percent = Number.parseFloat(respData.substring(respData.indexOf(beginKey) + beginKey.length, respData.indexOf(endKey)).trim());
      console.log('percent: %s', percent);
      // todo: fix not refresh process bar
      this.data[0].percent = percent;
    };
    evtSource.onerror = function (evt) {
      evtSource.close();
    }
  }

  submit() {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (this.form.invalid) return;
    // this.submitting = true;
    console.log('%O', this.form.value);
    this.msg.success('表单已提交, ' + this.form.get('targetUrl').value);
  }

  parseUrl() {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (this.form.invalid) return;
    this.submitting = true;
    this.http.get('youtube/formats', {targetUrl: this.form.get('targetUrl').value}).subscribe((res: any) => {
      this.loading = false;
      console.log('%O', res);
    });
  }

}

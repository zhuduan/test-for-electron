import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import {SimpleTableColumn, SimpleTableComponent, SimpleTableRowClick} from '@delon/abc';
import { SFSchema } from '@delon/form';
import {SysLogViewComponent} from "./view/view.component";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'sys-log',
  templateUrl: './log.component.html',
})
export class SysLogComponent implements OnInit {
  url = `/user`;
  searchSchema: SFSchema = {
    properties: {
      no: {
        type: 'string',
        title: '编号'
      }
    }
  };
  @ViewChild('st') st: SimpleTableComponent;
  columns: SimpleTableColumn[] = [
    { title: '编号', index: 'no' },
    { title: '调用次数', type: 'number', index: 'callNo' },
    { title: '头像', type: 'img', width: '50px', index: 'avatar' },
    { title: '时间', type: 'date', index: 'updatedAt' },
    {
      title: '',
      buttons: [
        // { text: '查看', click: (item: any) => `/form/${item.id}` },
        // { text: '编辑', type: 'static', component: FormEditComponent, click: 'reload' },
      ]
    }
  ];

  constructor(private http: _HttpClient, private msg: NzMessageService, private modal: ModalHelper) { }

  ngOnInit() { }

  add() {
    // this.modal
    //   .createStatic(FormEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
  }

  _click(e: SimpleTableRowClick, type: string) {
    console.log(type, e);
    this.modal
      .static(SysLogViewComponent, { i: { id: 0 } })
      .subscribe(() => {
        this.st.load();
        this.msg.info('回调，重新发起列表刷新');
      });  }
}

import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { TimeAxisData } from 'ng-devui/time-axis';
import {  mapOption, echartServiceOption, monitorOption1, monitorOption2, monitorOption3, monitorOption4, monitorOption5dead } from '../echarts';
import { chinaData } from 'src/app/@core/data/mapData';
import * as echarts from 'echarts';
import { ListDataService } from 'src/app/@core/mock/list-data.service';

@Component({
  selector: 'da-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss'],
})
export class MonitorComponent implements OnInit, OnDestroy, AfterViewInit {
  time_axis_data_horizontal!: TimeAxisData;

  timerForOccupation: any;
  timerForTotalUser: any;
  timerForLive: any;
  timerForService: any;

  monitorsOptions1 = monitorOption1;
  monitorsOptions2 = monitorOption2;
  monitorsOptions3 = monitorOption3;
  monitorsOptions4 = monitorOption4;
  monitorsOptions5 = monitorOption5dead;

  serviceOptions = echartServiceOption;
  mapOptions: any = mapOption;

  liveUsers = 200;
  totalUsers = 5000;
  liveProvince = '云南省';
  randomService = [];

  occupationChart1: any;
  occupationChart2: any;
  occupationChart3: any;
  occupationChart4: any;
  occupationChart5: any;
  serviceChart: any;

  constructor(private listDataService: ListDataService,) {}

  ngOnInit(): void {

      this.GetAllMission();
      this.getAllusers()

    // this.timerForService = setInterval(() => {
    //   let temp = this.serviceOptions.series[0].data.pop()!;
    //   console.log(temp);
    //    this.serviceOptions.series[0].data.unshift(temp);
    //    this.serviceChart.setOption(this.serviceOptions, true);
    // }, 1500);

    this.timerForOccupation = setInterval(() => {

      let random = Number((Math.random() * 100).toFixed(0));
      this.monitorsOptions1.series[0].data[0].value = this.Allmissionsencours.length;
      this.monitorsOptions2.series[0].data[0].value = this.Allmissionsinitier.length;
      this.monitorsOptions3.series[0].data[0].value = this.Allmissionsterminer.length;
      this.monitorsOptions4.series[0].data[0].value = this.allouvrier.length;
      this.monitorsOptions5.series[0].data[0].value = this.allclients.length;
      this.occupationChart1.setOption(this.monitorsOptions1, true);
      this.occupationChart2.setOption(this.monitorsOptions2, true);
      this.occupationChart3.setOption(this.monitorsOptions3, true);
      this.occupationChart4.setOption(this.monitorsOptions4, true);
      this.occupationChart5.setOption(this.monitorsOptions5, true);
      // this.GetAllMission();
      // this.getAllusers()
    }, 1500);

    // let chinaJSON = JSON.parse(chinaData);
    // echarts.registerMap('china', chinaJSON);

    // this.time_axis_data_horizontal = {
    //   direction: 'horizontal',
    //   model: 'text',
    //   list: [
    //     { text: 'Download', type: 'success', status: 'runned' },
    //     { text: 'Check', type: 'success', status: 'runned' },
    //     { text: 'Build', type: 'primary', status: 'running' },
    //     { text: 'Depoy', type: 'primary' },
    //     { text: 'End', type: 'primary' },
    //   ],
    // };

    //this.setMapData();
    // this.timerForTotalUser = setInterval(() => {
    //   this.totalUsers++;
    // }, 140);

    // this.timerForLive = setInterval(() => {
    //   let randomIndex = Number((Math.random() * 33).toFixed(0));
    //   this.liveProvince = this.mapOptions.series[0].data[randomIndex]['name'];
    //   this.liveUsers = Number((Math.random() * 500).toFixed(0));
    // }, 2000);


  }

  getOccupationChart1(event: any) {
    this.occupationChart1 = event;
  }
  getOccupationChart2(event: any) {
    this.occupationChart2 = event;
  }
  getOccupationChart3(event: any) {
    this.occupationChart3 = event;
  }
  getOccupationChart4(event: any) {
    this.occupationChart4 = event;
  }
  getOccupationChart5(event: any) {
    this.occupationChart5 = event;
  }

  Allmissionsinitier:any[]=[]
  Allmissionsterminer:any[]=[]
  Allmissionsencours:any[]=[]
  GetAllMission(){
    //console.log("t");
    this.Allmissionsinitier = [];
    this.Allmissionsterminer = [];
    this.Allmissionsencours = [];
    this.listDataService.getListAllData("list.php","mission").subscribe((data:any) =>{
      data.response.data.forEach((element:any) => {
        if(element.state == "initier"){
          this.Allmissionsinitier.push(element);
        }
        else if(element.state == "en cours"){
          this.Allmissionsencours.push(element);
        }
        else if(element.state == "terminer"){
          this.Allmissionsterminer.push(element);
        }
      });
    })
  }
  allouvrier:any[]=[]
  allclients:any[]=[]
  getAllusers(){
    //console.log("t");
    this.allouvrier = [];
    this.allclients = [];
    this.listDataService.getListAllData("list.php","users").subscribe((data:any) =>{
      data.response.data.forEach((element:any) => {
        if(element.role == "client"){
          this.allclients.push(element);
        }
        else if(element.role == "ouvrier"){
          this.allouvrier.push(element);
        }
      });
    })
  }

  getServiceChart(event: any) {
    this.serviceChart = event;
  }

  ngOnDestroy(): void {
    clearInterval(this.timerForOccupation);
    // clearInterval(this.timerForTotalUser);
    // clearInterval(this.timerForLive);
    // clearInterval(this.timerForService);
  }

  setMapData() {
    let data = JSON.parse(chinaData);
    let value = [];
    data['features'].forEach((data: any) => {
      let tempValue = Number((Math.random() * 200).toFixed(0));
      let temp = { name: data['properties']['name'], value: tempValue };
      value.push(temp);
    });
    value.push({
      name: '南海诸岛',
      value: 10,
    });
    this.mapOptions.series[0]['data'] = value;
  }

  ngAfterViewInit(): void {
    window.dispatchEvent(new Event('resize'));
  }
}

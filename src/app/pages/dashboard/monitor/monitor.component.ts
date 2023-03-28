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

  monitorOptions1 = monitorOption1;
  monitorOptions2 = monitorOption2;
  monitorOptions3 = monitorOption3;
  monitorOptions4 = monitorOption4;
  monitorsOptions5 = monitorOption5dead;

  serviceOptions = echartServiceOption;
  mapOptions: any = mapOption;

  liveUsers = 200;
  totalUsers = 5000;
  liveProvince = '云南省';
  randomService = [];

  occupationChart: any;
  serviceChart: any;

  constructor(private listDataService: ListDataService,) {}

  ngOnInit(): void {
    this.GetAllMission();
    this.getAllusers()
    let chinaJSON = JSON.parse(chinaData);
    echarts.registerMap('china', chinaJSON);

    this.time_axis_data_horizontal = {
      direction: 'horizontal',
      model: 'text',
      list: [
        { text: 'Download', type: 'success', status: 'runned' },
        { text: 'Check', type: 'success', status: 'runned' },
        { text: 'Build', type: 'primary', status: 'running' },
        { text: 'Depoy', type: 'primary' },
        { text: 'End', type: 'primary' },
      ],
    };

    //this.setMapData();

    this.timerForOccupation = setInterval(() => {
      let random = Number((Math.random() * 100).toFixed(0));
      this.monitorsOptions5.series[0].data[0].value = random;
      this.occupationChart.setOption(this.monitorsOptions5, true);
    }, 1500);

    // this.timerForTotalUser = setInterval(() => {
    //   this.totalUsers++;
    // }, 140);

    // this.timerForLive = setInterval(() => {
    //   let randomIndex = Number((Math.random() * 33).toFixed(0));
    //   this.liveProvince = this.mapOptions.series[0].data[randomIndex]['name'];
    //   this.liveUsers = Number((Math.random() * 500).toFixed(0));
    // }, 2000);

    // this.timerForService = setInterval(() => {
    //   let temp = this.serviceOptions.series[0].data.pop()!;
    //   this.serviceOptions.series[0].data.unshift(temp);
    //   this.serviceChart.setOption(this.serviceOptions, true);
    // }, 1500);
  }

  getOccupationChart(event: any) {
    this.occupationChart = event;
  }

  Allmissionsinitier:any[]=[]
  Allmissionsterminer:any[]=[]
  Allmissionsencours:any[]=[]
  GetAllMission(){
    this.Allmissionsinitier = [];
    this.Allmissionsterminer = [];
    this.Allmissionsencours = [];
    this.listDataService.getListAllData("list.php","mission").subscribe((data:any) =>{

    })
  }
  allouvrier:any[]=[]
  allclients:any[]=[]
  getAllusers(){
    this.listDataService.getListAllData("list.php","users").subscribe((data:any) =>{

    })
  }

  getServiceChart(event: any) {
    this.serviceChart = event;
  }

  ngOnDestroy(): void {
    clearInterval(this.timerForOccupation);
    clearInterval(this.timerForTotalUser);
    clearInterval(this.timerForLive);
    clearInterval(this.timerForService);
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

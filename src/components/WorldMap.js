import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import '../App.css'; // CSS 파일을 가져옵니다.

am4core.useTheme(am4themes_animated);

function WorldMap() {
  const [locations, setLocations] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fetch data from Flask API
    axios.get('/api/locations')
      .then(response => {
        setLocations(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  useEffect(() => {
    let chart = am4core.create("chartdiv", am4maps.MapChart);
    chart.geodata = am4geodata_worldLow;
    chart.projection = new am4maps.projections.Miller();

    let polygonSeries = new am4maps.MapPolygonSeries();
    polygonSeries.exclude = ["AQ"];
    polygonSeries.useGeodata = true;
    chart.series.push(polygonSeries);

    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.polygon.fillOpacity = 0.6;

    let hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#367B25");

    chart.zoomControl = new am4maps.ZoomControl();

    // Add markers for specified locations
    let imageSeries = chart.series.push(new am4maps.MapImageSeries());
    let imageSeriesTemplate = imageSeries.mapImages.template;
    let circle = imageSeriesTemplate.createChild(am4core.Circle);
    circle.radius = 6;
    circle.fill = am4core.color("#B27799");
    circle.stroke = am4core.color("#FFFFFF");
    circle.strokeWidth = 2;
    circle.nonScaling = true;
    circle.tooltipText = "{tooltip}";

    imageSeriesTemplate.propertyFields.latitude = "latitude";
    imageSeriesTemplate.propertyFields.longitude = "longitude";

    const groupedLocations = locations.reduce((acc, loc) => {
      const key = `${loc.latitude}-${loc.longitude}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(loc);
      return acc;
    }, {});

    const imageSeriesData = Object.values(groupedLocations).map(group => {
      const tooltipContent = group.map(loc => `[bold]${loc.group}조 ${loc.name}:[/] [bold]${loc.residence}[/]`).join("\n");
      return {
        latitude: group[0].latitude,
        longitude: group[0].longitude,
        tooltip: tooltipContent,
        group: group // 그룹 정보를 추가하여 이벤트 핸들러에서 사용
      };
    });

    imageSeries.data = imageSeriesData;

    imageSeriesTemplate.events.on("hit", function(ev) {
      ev.event.stopPropagation();  // 이 이벤트가 상위로 전파되지 않도록 함
      setSelectedGroup(ev.target.dataItem.dataContext.group);
      setIsVisible(true); // 슬라이드 인 애니메이션을 위해 표시
    });

    return () => {
      chart.dispose();
    };
  }, [locations]);

  const handleHide = () => {
    setIsVisible(false);
    setTimeout(() => setSelectedGroup([]), 500); // 애니메이션 후 상태 초기화
  };

  return (
    <div style={{ display: 'flex', position: 'relative' }}>
      <div id="chartdiv" style={{ width: isVisible ? "70%" : "100%", height: "500px", transition: 'width 0.5s' }}></div>
      <div className={isVisible ? "slide-in" : "slide-out"} style={{ width: "30%", padding: '20px', borderLeft: '1px solid #ccc', position: 'absolute', right: isVisible ? '0' : '-30%', transition: 'right 0.5s' }}>
        {selectedGroup.length > 0 && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Selected Group Members</h2>
              <button onClick={handleHide} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>×</button>
            </div>
            <ul>
              {selectedGroup.map((member, index) => (
                <li key={index}>
                  <strong>{member.group}조 {member.name}</strong><br />
                  {member.residence}<br />
                  {member.latitude}, {member.longitude}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default WorldMap;

import { OPEN_WEATHER_API_KEY, THINKSPEAK_API_KEY } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import 'chart.js/auto';
import {
  Calendar,
  Clock,
  CloudSun,
  Droplets,
  MapPin,
  ThermometerSun,
} from 'lucide-react';
import { useState } from 'react';
import { Chart } from 'react-chartjs-2';

export default function Info() {
  const [temperature, setTemperature] = useState([]);
  const [humidity, setHumidity] = useState([]);
  const date = new Date();

  const weather = useQuery({
    queryKey: ['weather', 'Ho Chi Minh City'],
    queryFn: async () => {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Ho Chi Minh City&appid=${OPEN_WEATHER_API_KEY}`
      );

      return response.json();
    },
  });

  const temperatureLogs = useQuery({
    queryKey: ['temperatureLogs'],
    queryFn: async () => {
      const response = await fetch(
        `https://api.thingspeak.com/channels/2788103/fields/1.json?api_key=${THINKSPEAK_API_KEY}`
      );

      const data = await response.json();

      setTemperature(
        data.feeds.map((feed) => {
          return {
            date: new Date(feed.created_at),
            data: feed.field1,
          };
        })
      );

      return data;
    },
    refetchInterval: 5000,
  });

  const humidityLogs = useQuery({
    queryKey: ['humidityLogs'],
    queryFn: async () => {
      const response = await fetch(
        `https://api.thingspeak.com/channels/2788103/fields/2.json?api_key=${THINKSPEAK_API_KEY}`
      );

      const data = await response.json();
      console.log(data);

      setHumidity(
        data.feeds.map((feed) => {
          return {
            date: new Date(feed.created_at),
            data: feed.field2,
          };
        })
      );

      return data;
    },
    refetchInterval: 5000,
  });

  return (
    <section className='w-fit h-[80%] overflow-scroll pt-8 pr-8 flex flex-col gap-8'>
      <h3 className='text-2xl font-bold'>Environment Information</h3>
      <div className='flex flex-col gap-3'>
        <div className='flex gap-2'>
          <Calendar />
          <p>Date: {date.toDateString()}</p>
        </div>
        <div className='flex gap-2'>
          <Clock />
          <p>Time: {`${date.getHours()}h${date.getMinutes()}`}</p>
        </div>
        <div className='flex gap-2'>
          <MapPin />
          <p>Location: Ho Chi Minh City</p>
        </div>
        <div className='flex gap-2'>
          <CloudSun />
          <p className='capitalize'>
            Weather: {weather.data?.weather[0].description}
          </p>
        </div>
      </div>
      <div className='p-4 bg-white rounded-xl'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <ThermometerSun
              className='bg-[#F06428] text-white p-2 rounded-xl'
              size={40}
            />
            <h3 className='text-2xl'>Temperature (Cº)</h3>
          </div>
          <Chart
            type='line'
            options={{
              scales: {
                x: {
                  type: 'time',
                },
                y: {
                  type: 'linear',
                },
              },
            }}
            data={{
              labels: temperature.map((data) => data.date),
              datasets: [
                {
                  label: 'Temperature',
                  data: temperature.map((data) => data.data),
                  fill: false,
                  borderColor: '#F06428',
                  tension: 0.35,
                },
              ],
            }}
          />
          {/* <div className='w-[300px] h-[200px]'>
            <Chart options={{ data: series, primaryAxis, secondaryAxes }} />
          </div> */}
        </div>
      </div>
      <div className='p-4 bg-white rounded-xl'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <Droplets
              className='bg-[#2892F0] text-white p-2 rounded-xl'
              size={40}
            />
            <h3 className='text-2xl'>Humidity (%)</h3>
          </div>
          <Chart
            type='line'
            options={{
              scales: {
                x: {
                  type: 'time',
                },
                y: {
                  type: 'linear',
                },
              },
            }}
            data={{
              labels: humidity.map((data) => data.date),
              datasets: [
                {
                  label: 'Temperature',
                  data: humidity.map((data) => data.data),
                  fill: false,
                  borderColor: '#F06428',
                  tension: 0.35,
                },
              ],
            }}
          />
        </div>
      </div>
    </section>
  );
}

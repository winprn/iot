import { THINKSPEAK_API_KEY, type Series } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Zap } from 'lucide-react';
import { useRef } from 'react';
import { Chart } from 'react-chartjs-2';

const series: Series[] = [
  {
    label: 'Electric use (kWh)',
    data: [
      { date: new Date(2021, 1, 1), data: 18.5 },
      { date: new Date(2021, 1, 2), data: 27.4 },
      { date: new Date(2021, 1, 3), data: 20.4 },
      { date: new Date(2021, 1, 4), data: 25 },
      { date: new Date(2021, 1, 5), data: 29 },
      { date: new Date(2021, 1, 6), data: 30 },
    ],
  },
];

export default function HistoryPage() {
  const barRef = useRef();
  const sensorLogs = useQuery({
    queryKey: ['sensorLogs'],
    queryFn: async () => {
      const response = await fetch(
        `https://api.thingspeak.com/channels/2788103/feeds.json?api_key=${THINKSPEAK_API_KEY}`
      );

      const data = await response.json();
      data.feeds.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();

        return -(dateA - dateB);
      });

      return data;
    },
    refetchInterval: 5000,
  });

  return (
    <section className='flex flex-col grow h-[80%] p-8'>
      <h3 className='text-2xl'>History</h3>
      <div className='flex flex-col items-center grow overflow-scroll'>
        {sensorLogs.isLoading ? (
          <p>Loading...</p>
        ) : sensorLogs.isError ? (
          <p>Error: {sensorLogs.error.message}</p>
        ) : (
          sensorLogs.data.feeds.map((feed) => (
            <div key={feed.entry_id} className='w-3/4'>
              <div className='flex gap-2 items-center justify-between'>
                <div className='flex gap-1 items-center min-w-[200px]'>
                  <div className='h-3 w-3 rounded-full bg-green-500' />
                  <p>Temperature: </p>
                  <p>{Number.parseFloat(feed.field1).toFixed(1)}*C</p>
                </div>
                {(() => {
                  const date = new Date(feed.created_at);
                  const day = String(date.getDate()).padStart(2, '0');
                  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
                  const year = date.getFullYear();
                  return (
                    <>
                      <p>{`${date.getHours()}:${date.getMinutes()}`}</p>
                      <p>{`${day}/${month}/${year}`}</p>
                    </>
                  );
                })()}
              </div>
              <div className='flex gap-2 items-center justify-between'>
                <div className='flex gap-1 items-center min-w-[200px]'>
                  <div className='h-3 w-3 rounded-full bg-green-500' />
                  <p>Humidity: </p>
                  <p>{Number.parseFloat(feed.field2).toFixed(1)}*C</p>
                </div>
                {(() => {
                  const date = new Date(feed.created_at);
                  const day = String(date.getDate()).padStart(2, '0');
                  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
                  const year = date.getFullYear();
                  return (
                    <>
                      <p>{`${date.getHours()}:${date.getMinutes()}`}</p>
                      <p>{`${day}/${month}/${year}`}</p>
                    </>
                  );
                })()}
              </div>
              <div className='flex gap-2 items-center justify-between'>
                <div className='flex gap-1 items-center min-w-[200px]'>
                  <div className='h-3 w-3 rounded-full bg-green-500' />
                  <p>LDR Value: </p>
                  <p>{Number.parseFloat(feed.field3).toFixed(1)}*C</p>
                </div>
                {(() => {
                  const date = new Date(feed.created_at);
                  const day = String(date.getDate()).padStart(2, '0');
                  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
                  const year = date.getFullYear();
                  return (
                    <>
                      <p>{`${date.getHours()}:${date.getMinutes()}`}</p>
                      <p>{`${day}/${month}/${year}`}</p>
                    </>
                  );
                })()}
              </div>
              <div className='flex gap-2 items-center justify-between'>
                <div className='flex gap-1 items-center min-w-[200px]'>
                  <div className='h-3 w-3 rounded-full bg-green-500' />
                  <p>PIR Value: </p>
                  <p>{Number.parseFloat(feed.field4).toFixed(1)}*C</p>
                </div>
                {(() => {
                  const date = new Date(feed.created_at);
                  const day = String(date.getDate()).padStart(2, '0');
                  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
                  const year = date.getFullYear();
                  return (
                    <>
                      <p>{`${date.getHours()}:${date.getMinutes()}`}</p>
                      <p>{`${day}/${month}/${year}`}</p>
                    </>
                  );
                })()}
              </div>
            </div>
          ))
        )}
      </div>
      <div className='p-4 bg-white w-[50%] mx-auto rounded-xl mt-10'>
        <div className='flex gap-2 items-center'>
          <Zap className='bg-[#B16CFF] text-white p-2 rounded-xl' size={50} />
          <p className='text-xl'>Energy</p>
        </div>
        <Chart
          type='bar'
          ref={barRef}
          data={{
            labels: series[0].data.map((d) =>
              d.date.toLocaleString('en-US', { weekday: 'short' })
            ),
            datasets: [
              {
                label: series[0].label,
                data: series[0].data.map((d) => d.data),
                backgroundColor: '#E8F3FC',
                borderRadius(ctx, options) {
                  return 8;
                },
                hoverBackgroundColor(ctx, options) {
                  return '#2396EF';
                },
              },
            ],
          }}
          options={{
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
    </section>
  );
}

<!-- filepath: /Users/tfg/Documents/astro-svelte-comparison/sveltekit/src/lib/components/PerformanceTracker/Components/Timeline.svelte -->
<script lang="ts">
	import * as echarts from 'echarts/core';
	import { onMount, onDestroy } from 'svelte';
	import { BarChart } from 'echarts/charts';
	import { GridComponent, TooltipComponent, TitleComponent } from 'echarts/components';
	import { CanvasRenderer } from 'echarts/renderers';

	echarts.use([BarChart, GridComponent, TooltipComponent, TitleComponent, CanvasRenderer]);

	interface TimelineMetric {
		name: string;
		startTime: number;
		duration?: number | null;
		color?: string;
	}

	let { metrics, maxTime } = $props();
	let chartDiv: HTMLDivElement;
	let chartInstance: echarts.ECharts | null = null;

	let options = $derived.by(() => {
		const data: { name: string; value: [number, number]; itemStyle: { color: string } }[] =
			metrics.map((m: TimelineMetric) => ({
				name: m.name,
				value: [m.startTime, m.duration && m.duration > 0 ? m.duration : 0.5],
				itemStyle: { color: m.color || '#3B82F6' }
			}));
		return {
			title: {
				text: 'Performance Gantt Chart',
				left: 'center',
				top: 0,
				textStyle: { fontSize: 16 }
			},
			tooltip: {
				formatter: (params: { name: string; value: [number, number] }) => {
					const { name, value } = params;
					return `<b>${name}</b><br>Start: ${value[0].toFixed(1)} ms<br>Duration: ${value[1].toFixed(1)} ms<br>End: ${(value[0] + value[1]).toFixed(1)} ms`;
				}
			},
			grid: { left: 120, right: 40, top: 40, bottom: 30 },
			xAxis: {
				min: 0,
				max: maxTime,
				name: 'ms',
				axisLabel: { fontSize: 12 },
				splitLine: { show: true, lineStyle: { color: '#eee' } }
			},
			yAxis: {
				type: 'category',
				data: data.map((d) => d.name),
				axisLabel: { fontSize: 12 },
				inverse: true
			},
			series: [
				{
					type: 'bar',
					data,
					barWidth: 16,
					label: {
						show: true,
						position: 'right',
						formatter(params: { value: [number, number] }) {
							return `${(params.value[0] + params.value[1]).toFixed(1)} ms`;
						},
						fontSize: 10
					},
					itemStyle: { borderRadius: 4 }
				}
			],
			animationDurationUpdate: 300
		};
	});

	$effect(() => {
		if (chartInstance && options) {
			chartInstance.setOption(options, true);
		}
	});

	onMount(() => {
		if (chartDiv) {
			chartInstance = echarts.init(chartDiv);
			chartInstance.setOption(options, true);
			window.addEventListener('resize', resizeChart);
		}
	});

	onDestroy(() => {
		if (chartInstance) {
			chartInstance.dispose();
		}
		window.removeEventListener('resize', resizeChart);
	});

	function resizeChart() {
		if (chartInstance) chartInstance.resize();
	}
</script>

<div class="mb-6 rounded-lg bg-gray-50 p-6 shadow-sm">
	<h3 class="mb-6 text-lg font-medium text-gray-800">Performance Timeline</h3>
	<div bind:this={chartDiv} style="width: 100%; height: 400px;"></div>
</div>

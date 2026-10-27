<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { motionPreference } from "$lib/stores/motion";

	interface Snowflake {
		x: number;
		y: number;
		vx: number;
		vy: number;
		radius: number;
		opacity: number;
		drift: number;
		driftSpeed: number;
	}

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;
	let animationId: number | null = null;
	let snowflakes: Snowflake[] = [];
	let width = 0;
	let height = 0;
	let isHidden = false;

	$: reducedMotion = $motionPreference === "reduced";

	function createSnowflake(): Snowflake {
		return {
			x: Math.random() * width,
			y: Math.random() * -height * 0.5,
			vx: (Math.random() - 0.5) * 0.3,
			vy: 0.5 + Math.random() * 1.2,
			radius: 1 + Math.random() * 2.5,
			opacity: 0.3 + Math.random() * 0.7,
			drift: Math.random() * Math.PI * 2,
			driftSpeed: 0.01 + Math.random() * 0.02
		};
	}

	function initSnowflakes() {
		snowflakes = [];
		const count = Math.min(120, Math.floor((width * height) / 15000));
		for (let i = 0; i < count; i++) {
			snowflakes.push(createSnowflake());
		}
	}

	function resize() {
		if (!canvas) return;
		width = window.innerWidth;
		height = window.innerHeight;
		canvas.width = width;
		canvas.height = height;
		initSnowflakes();
	}

	function animate() {
		if (!ctx || isHidden || reducedMotion) {
			animationId = requestAnimationFrame(animate);
			return;
		}

		ctx.clearRect(0, 0, width, height);

		for (let i = 0; i < snowflakes.length; i++) {
			const flake = snowflakes[i];
			flake.drift += flake.driftSpeed;
			flake.x += flake.vx + Math.sin(flake.drift) * 0.3;
			flake.y += flake.vy;

			if (flake.y > height + flake.radius) {
				snowflakes[i] = createSnowflake();
				snowflakes[i].y = -flake.radius;
				continue;
			}

			if (flake.x < -flake.radius) flake.x = width + flake.radius;
			if (flake.x > width + flake.radius) flake.x = -flake.radius;

			ctx.beginPath();
			ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
			ctx.fill();
		}

		animationId = requestAnimationFrame(animate);
	}

	function handleVisibilityChange() {
		isHidden = document.hidden;
	}

	onMount(() => {
		if (!canvas) return;
		ctx = canvas.getContext("2d");
		resize();
		window.addEventListener("resize", resize);
		document.addEventListener("visibilitychange", handleVisibilityChange);
		animationId = requestAnimationFrame(animate);
	});

	onDestroy(() => {
		if (animationId !== null) {
			cancelAnimationFrame(animationId);
		}
		window.removeEventListener("resize", resize);
		document.removeEventListener("visibilitychange", handleVisibilityChange);
	});
</script>

{#if !reducedMotion}
	<canvas
		bind:this={canvas}
		class="pointer-events-none fixed inset-0 -z-10"
		aria-hidden="true"
	></canvas>
{/if}

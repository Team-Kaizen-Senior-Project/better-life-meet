<script setup>
	defineProps(['podNumber', 'joinText'])
</script>
<template>
	<div class="inline-flex flex-col items-center gap-5 self-start rounded-lg bg-zinc-900 p-5">
		<div class="relative h-[234px] w-[234px]">
			<div class="absolute left-[63px] top-[184px] inline-flex h-[50px] w-[108px] items-start justify-start gap-2">
				<div class="h-[50px] w-[50px] rounded-lg border border-zinc-700 bg-zinc-800" />
				<div class="h-[50px] w-[50px] rounded-lg border border-zinc-700 bg-zinc-800" />
			</div>
			<div class="absolute left-[63px] top-0 inline-flex h-[50px] w-[108px] items-start justify-start gap-2">
				<div class="h-[50px] w-[50px] rounded-lg border border-zinc-700 bg-zinc-800" />
				<div class="h-[50px] w-[50px] rounded-lg border border-zinc-700 bg-zinc-800" />
			</div>
			<div class="absolute left-0 top-[63px] inline-flex h-[108px] w-[50px] flex-col items-start justify-start gap-2">
				<div class="h-[50px] w-[50px] rounded-lg border border-zinc-700 bg-zinc-800" />
				<div class="h-[50px] w-[50px] rounded-lg border border-zinc-700 bg-zinc-800" />
			</div>
			<div
				class="absolute left-[184px] top-[63px] inline-flex h-[108px] w-[50px] flex-col items-start justify-start gap-2"
			>
				<div class="h-[50px] w-[50px] rounded-lg border border-zinc-700 bg-zinc-800" />
				<div class="h-[50px] w-[50px] rounded-lg border border-zinc-700 bg-zinc-800" />
			</div>
			<div class="absolute left-[42px] top-[42px] h-[150px] w-[150px]">
				<div
					class="absolute left-0 top-0 h-[150px] w-[150px] rounded-lg border border-zinc-700 bg-zinc-800 shadow-xl"
				></div>
				<div class="absolute inset-0 flex flex-col items-center justify-center gap-4">
					<div class="text-center text-base font-medium leading-snug text-white">{{ podNumber }}</div>
					<Button v-if="joinText" type="primary" class="bg-sky-500 hover:bg-sky-600">Join</Button>
				</div>
			</div>
		</div>
	</div>
</template>

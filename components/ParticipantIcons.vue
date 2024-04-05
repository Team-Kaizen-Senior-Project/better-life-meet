<script setup lang="ts">
	const { peers } = useHms()

	const hashCode = (str: string) => {
		let hash = 0
		for (let i = 0; i < str.length; i++) {
			hash = (hash << 5) - hash + str.charCodeAt(i)
			hash |= 0 // Convert to 32-bit integer
		}
		return hash
	}

	const generateColor = (firstName: string | undefined, lastName: string | undefined) => {
		// hsl class for unique customer icon color
		let color: string
		if (firstName && lastName) {
			const hash = hashCode(firstName + lastName)
			const hue = hash % 360
			color = `hsl(${hue}, 40%, 60%, 0.90)`
		} else {
			color = `hsl(35, 3%, 84%, 0.80)` // default
		}
		return color
	}
</script>

<template>
	<div class="flex items-center justify-center">
		<div class="relative">
			<div
				v-for="(peer, index) in peers"
				:key="peer.id"
				class="absolute"
				:style="{ top: '-15px', left: 'calc(50% - ' + index * -30 + 'px' }"
			>
				<button
					class="inline-block aspect-[1/1] h-10 w-10 rounded-full text-white"
					:style="{ backgroundColor: generateColor(peer.name.split(' ')[0], peer.name.split(' ')[1]) }"
				>
					{{ peer.name.split(' ')[0][0] }}{{ peer.name.split(' ')[1][0] }}
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
.absolute {
  position: absolute;
}
</style>

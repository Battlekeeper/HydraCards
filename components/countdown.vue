 
  <script setup lang="ts">
  import { ref, watch, onUnmounted } from "vue";
  
  const minutes = ref(0);
  const seconds = ref(0);
  const countdownRunning = ref(false);
  const displayMinutes = ref(minutes.value);
  const displaySeconds = ref(seconds.value);
  let countdownInterval: NodeJS.Timeout | null = null;
  
  const formatNumber = (number: number) => {
	return number < 10 ? "0" + number : number.toString();
  };
  
  const updateTime = () => {
	minutes.value = parseInt(minutes.value.toString());
	seconds.value = parseInt(seconds.value.toString());
  };
  
  watch(minutes, (newMinutes) => {
	displayMinutes.value = newMinutes;
  });
  
  watch(seconds, (newSeconds) => {
	displaySeconds.value = newSeconds;
  });
  
  const startTimer = () => {
	let totalSeconds = minutes.value * 60 + seconds.value;
	countdownRunning.value = true;
  
	countdownInterval = setInterval(() => {
	  if (totalSeconds > 0) {
		seconds.value = totalSeconds % 60;
		minutes.value = Math.floor(totalSeconds / 60);
		totalSeconds--;
	  } else {
		stopTimer();
	  }
	}, 1000);
  };
  
  const stopTimer = () => {
	countdownRunning.value = false;
	if (countdownInterval) {
	  clearInterval(countdownInterval);
	  countdownInterval = null;
	}
  };
  
  onUnmounted(() => {
	stopTimer();
  });

  </script>
  
  <template>
	<div class="flex justify-center h-100">
	  <div class="font-md cursor-pointer relative">
		<div class="flex justify-center">
		  <div v-if="!countdownRunning" class="flex items-center space-x-2 absolute left-24 -top-4">
			<input type="number" v-model.number="minutes" @input="updateTime" :disabled="countdownRunning" min="0" class="w-20 flex justify-end px-2 py-1 bg-slate-600 rounded-md "/>
			<span class="font-bold">:</span>
			<input type="number" v-model.number="seconds" @input="updateTime" :disabled="countdownRunning" min="0" max="59" class="w-20 px-2 py-1 bg-slate-600 rounded-md text-left" />
		  </div>
		  <div v-else class="flex justify-center">
			<span class="flex items-center space-x-2 absolute left-24 -top-3">{{ formatNumber(displayMinutes) }}</span>
			<span class="flex items-center space-x-2 absolute left-36 -top-3">:</span>
			<span class="flex items-center space-x-2 absolute left-40 -top-3">{{ formatNumber(displaySeconds) }}</span>
		  </div>
		</div>
  
		<div v-if="!countdownRunning">
		  <button @click="startTimer" class="w-20 h-10 mr-2 bg-orange-500 rounded-md cursor-pointer absolute left-64 -top-5 text-white">
			Start Timer
		  </button>
		</div>
	  </div>
	</div>
  </template>
  

  
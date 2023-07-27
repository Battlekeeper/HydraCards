<script setup lang="ts">
import { ref } from 'vue';
import HCRoom from "../backend/models/HCRoom";
import HCUser from "../backend/models/HCUser";
import Toggle from '@vueform/toggle'

const currentUser = ref(new HCUser)
const currentRoom = ref(new HCRoom)
const showComponent = ref(false)
const config = useRuntimeConfig()
const root = ref(null)
const props = defineProps(["content", "pagelink", "size"])
const url = ref("")
const name = ref("")
const roomTopicName = ref("")
const route = useRoute()
const userId: Ref<string> = ref(useCookie('_id').value as string)
const { data: user } = await useFetch(`api/user/getUserById?id=` + userId.value, { baseURL: config.public.serverUrl })
currentUser.value = user.value as HCUser
name.value = currentUser.value.displayName
const file:Ref<any> = ref()
const fileUrl:Ref<any> = ref()
const value = ref(true)


async function apiCreateRoom() {
	var response = await useFetch("api/room/createRoom", { credentials: "include", baseURL: config.public.baseUrl })
	//@ts-ignore
	let room: HCRoom = response.data.value?.room as unknown as HCRoom
	//router.push({ path: 'room', query: { id: room.id } })
	//TODO: Find a way to have router.push not be shallow redirect
	
	if (currentUser.value.currentRoom != undefined) {
		if (currentUser.value.currentRoom.toString() != route.query.id) {
			response = await useFetch("api/room/joinRoom?id=" + route.query.id, { credentials: "include", baseURL: config.public.baseUrl })
			//@ts-ignore
			userId.value = response?.data.value.id
		}
	} else {
		response = await useFetch("api/room/joinRoom?id=" + route.query.id, { credentials: "include", baseURL: config.public.baseUrl })
		//@ts-ignore
		userId.value = response?.data.value.id
	}
	const formData = new FormData();
	formData.append('profileImage', file.value);
	fetch("api/user/profileupload", { method: "POST", body: formData })
	await useFetch("api/user/setname?name=" + name.value, { credentials: "include", baseURL: config.public.baseUrl })

	window.location.href = "/room?id=" + room.id
}

onMounted(() => {
	
})
</script>

<template>

	<div class="bg-slate-50 dark:bg-slate-800 rounded-2xl border flex" :style="{ width: size + 'px', height: (size/(2)) + 'px' }">
  <div class="w-80 h-16 pl-4 pr-36 py-5 left-[33.02px] top-[65px] absolute bg-gray-300 dark:bg-slate-600 rounded-md gap-2.5">
    <input placeholder="Enter Story Name" v-model="roomTopicName" class="text-slate-300 shadow w-72 rounded bg-gray-300 dark:bg-slate-600 font-normal">
  </div>
</div>
  <div class="left-[33px] top-[38px] absolute dark:text-slate-300 text-base font-normal leading-normal">Story Title</div>
  <div class="w-44 h-14 left-[600.98px] top-[320px] absolute justify-start items-start inline-flex">
    <div class="w-44 h-14 px-7 py-4 dark:hover:bg-orange-500 hover:border hover:border-blue-800 hover:bg-slate-50 bg-blue-800 dark:bg-orange-500 rounded-md shadow justify-center items-center gap-2 flex">
      <button @click="apiCreateRoom()" class="text-slate-50 hover:text-blue-800 dark:text-white-500 text-lg font-medium leading-7">Create Room</button>
    </div>
  </div>
  <div class="w-40 h-11 left-[421.98px] top-[325px] absolute justify-start items-start inline-flex">
    <div class="w-40 h-11 justify-start items-start flex">
      <div class="w-40 h-11 px-4 py-3 rounded-md shadow border border-blue-800 dark:border-orange-500 justify-center items-center gap-2 flex">
        <button @click="showComponent = false" class="text-blue-800 dark:text-orange-500 text-base font-medium leading-normal">Cancel</button>
      </div>
    </div>
  </div>
  <div class="left-[33px] top-[142px] absolute">
    <div>
      <div class="w-80 h-36 left-0 top-[12px] absolute bg-gray-300 dark:bg-slate-600 rounded-md shadow">
      <div class="w-72 h-11 px-3.5 py-2.5 left-[14px] top-[77px] absolute bg-slate-50 dark:bg-slate-600 rounded-lg shadow gap-2">
        <div class="h-6 justify-start items-center gap-2 flex ">
          <input class="dark:text-gray-300 font-normal leading-normal bg-slate-50 dark:bg-slate-600 w-60" type="text" v-model="name" placeholder="Enter your name">
        </div>
      </div>
    </div>
    <div class="left-[18px] top-[30px] absolute dark:text-slate-50 text-xl font-bold leading-loose">Nickname</div>
  </div>
</div>
  <div class="w-96 h-60 left-[414px] top-[51px] absolute flex-col justify-center items-start gap-0.5 inline-flex">
    <div class="w-96 h-40 relative flex-col justify-start items-start flex">
      <div class="w-96 h-40 relative">
        <div class="w-96 h-36 left-0 top-[12px] absolute bg-gray-300 dark:bg-slate-600 rounded-md shadow"></div>
          <div class="w-8 h-4 left-4 top-6 absolute">
				<div class="w-60 dark:text-slate-50 text-2xl font-bold relative leading-loose">Timed Room</div>
      			<div class="w-72 h-16 dark:text-slate-400 text-base font-medium leading-normal">Change whether players must submit their answers by a certain time.</div>
						<Toggle class="relative left-72 -top-24" v-model="value"/>
			</div>
      </div>
      
    </div>
    <div class="w-96 flex-col items-center inline-flex">
      <div class="gap-10 inline-flex relative">
        <div class="dark:text-slate-300 text-sm font-normal">HRS</div>
        <div class="dark:text-slate-300 text-sm font-normal">MINS</div>
        <div class="dark:text-slate-300 text-sm font-normal">SECS</div>
      </div>
      <div class="w-96 h-16 bg-gray-300 dark:bg-slate-600 rounded-2xl justify-center items-center gap-8 inline-flex">
        <div class="gap-2.5 flex">
          <div class="w-14 h-10 p-2.5 dark:bg-slate-800 rounded-md justify-center items-center gap-2.5 flex">
            <input class="w-12 text-center dark:text-slate-300 text-4xl" type="text" placeholder="00">
        </div>
          <div class="w-2.5 h-7 text-center dark:text-slate-300 text-4xl font-normal leading-10">:</div>
          <div class="w-14 h-10 p-2.5 dark:bg-slate-800 rounded-md justify-center items-center gap-2.5 flex">
            <div class="w-12 text-center dark:text-slate-300 text-4xl font-normal leading-10" type="text" placeholder="00">
          </div>
          <div class="w-2.5 h-7 text-center dark:text-slate-300 text-4xl font-normal leading-10">:</div>
          <div class="w-14 h-10 p-2.5 dark:bg-slate-800 rounded-md justify-center items-center gap-2.5 flex">
            <div class="text-center dark:text-slate-300 text-4xl font-normal leading-10" type="text" placeholder="00">
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
</template>
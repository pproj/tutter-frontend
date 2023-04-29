<template>
    <div>
        <img src="@/assets/tutter_not_found.svg" alt="Not found" class="w-100"/>
        <div class="text-center py-3">{{ text }}</div>
    </div>
</template>

<script>
export default {
    name: "NotFoundArt",
    props: {
        text: {
            type: String,
            default: "The thing you are looking for is nowhere to be found"
        }
    }
}
</script>
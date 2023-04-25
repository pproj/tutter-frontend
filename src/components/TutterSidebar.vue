<template>
    <div style="background-color: white">
        <div class="py-5 text-right">
            <b-link :to="{ name: 'home' }">
                <img src="@/assets/tutter_with_text.svg" alt="Tutter logo" class="w-100"/>
            </b-link>
            <b>@marcsello</b>
        </div>
        <div class="py-5">
            <h2>Trending tags</h2>
            <div id="trendingTagsHolder" class="w-100 text-wrap text-justify">
                <b-link>#lofasz </b-link>
                <b-link>#lofas </b-link>
                <b-link>#lof </b-link>
                <b-link>#lofsz </b-link>
                <b-link>#lofaasz </b-link>
                <b-link>#lofaaasz </b-link>
                <b-link>#lofasz </b-link>
                <b-link>#lofas </b-link>
                <b-link>#lof </b-link>
                <b-link>#lofsz </b-link>
                <b-link>#lofaasz </b-link>
                <b-link>#lofaaasz </b-link>
                <b-link>#lofasz </b-link>
                <b-link>#lofas </b-link>
                <b-link>#lof </b-link>
                <b-link>#lofsz </b-link>
                <b-link>#lofaasz </b-link>
                <b-link>#lofaaasz </b-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "TutterSidebar"
}
</script>

<style scoped>
div#trendingTagsHolder {
    word-break: normal;
    line-break: auto;
    white-space: break-spaces;
}
</style>
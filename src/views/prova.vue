<template>
    <div class="blue-page">
        <h1>Pagina in Blue</h1>
        <table>
            <thead>
            <tr>
                <th>Pippo</th>
                <th>Paperino</th>
                <th>Topolino</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>Valore 1</td>
                <td>Valore 2</td>
                <td>Valore 3</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
    const name = "ProvaPage";
</script>

<style scoped>
.blue-page {
    background-color: blue;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
}

h1 {
    font-size: 30px;
}
</style>
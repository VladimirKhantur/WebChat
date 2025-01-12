<template>
  <router-view />
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}

h2 {
  color: #333;
}

form {
  margin-bottom: 20px;
}

input {
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

p {
  margin-top: 10px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  background-color: #42b983;
  color: white;
  border-radius: 5px;
}

button:hover {
  background-color: #369f6e;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 10px 0;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

li:hover {
  background-color: #42b983;
  color: white;
}
</style>
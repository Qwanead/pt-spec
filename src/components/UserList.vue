<template>
<table class="users">
  <caption><h1>User list</h1></caption>
  <tr v-if="users.length > 0">
    <th>First name</th>
    <th>Second name</th>
    <th></th>
    <th></th>
  </tr>

  <tr v-for="user in users" v-bind:key="user.uuid">
    <td>
      <input
        v-model="user.firstName"
        v-bind:readonly="user.isModeView"
        v-on:keyup.enter="editUser(user)"
      >
    </td>
    <td>
      <input
        v-model="user.secondName"
        v-bind:readonly="user.isModeView"
        v-on:keyup.enter="editUser(user)"
      >
    </td>
    <td>
      <button v-on:click="editUser(user)">
        {{ user.isModeView ? 'Edit' : 'Save' }}
      </button>
    </td>
    <td><button v-on:click="deleteUser(user)">Delete</button></td>
  </tr>

  <tr class="row-btn">
    <td colspan="4">
      <button class="btn-add" v-on:click="addNewUser">Add user</button>
    </td>
  </tr>
</table>
</template>

<script>
import api from '../api';

export default {
  name: 'UserLIst',

  data() {
    return {
      users: [],
    };
  },

  created() {
    api.get({}).then((response) => {
      this.users = response;
      this.users.forEach((_, i) => {
        this.users[i].isModeView = true;
      });
    });
  },

  methods: {
    findUser(uuid) {
      return this.users.find((user) => user.uuid === uuid);
    },

    updateUser({ uuid, firstName, secondName }) {
      const targetUser = this.findUser(uuid);

      targetUser.uuid = uuid;
      targetUser.firstName = firstName;
      targetUser.secondName = secondName;
    },

    addNewUser() {
      const newUser = {
        firstName: '',
        secondName: '',
        isModeView: true,
      };

      api.post(newUser).then(({ uuid }) => {
        newUser.uuid = uuid;
        this.users.push(newUser);
      });
    },

    editUser(user) {
      const targetUser = this.findUser(user.uuid);
      if (targetUser.isModeView) {
        targetUser.isModeView = !targetUser.isModeView;
      } else {
        api.put(user).then((response) => {
          this.updateUser(response);
          targetUser.isModeView = !targetUser.isModeView;
        });
      }
    },

    deleteUser(user) {
      api.del(user).then(() => {
        this.users = this.users.filter((it) => it.uuid !== user.uuid);
      });
    },
  },
};
</script>

<style>
.users {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 40%;
  margin: 0 auto;
}

.users h1{
  color: #04AA6D;
}

.users td, .users th {
  border: 1px solid #ddd;
  padding: 8px;
}

.users tr:nth-child(even){background-color: #f2f2f2;}

.users th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #04AA6D;
  color: white;
}

.users input {
  border: none;
  background: none;
  font-size: inherit;
}

.users input:disabled {
  background-color: inherit;
  color: inherit;
}

.users button {
  display: block;
  background-color: #04AA6D;
  color: white;
  text-align: center;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  min-width: 55px;
}

.users button.btn-add {
  display: block;
  font-size: 22px;
  font-weight: bold;
  margin: 0 auto;
  padding: 5px 35px;
}

.users tr.row-btn {
  background: none;
}

.users .row-btn td {
  border: none;
}
</style>

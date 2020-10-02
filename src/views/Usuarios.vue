<template>
	<div>
		<v-card class="mb-4 pa-4 mx-auto" width="75%" v-if="formVisible">
			<v-container>
				<div class="mb-4">{{ formTitle }}</div>
				<v-row>
					<v-col cols="12" sm="6">
						<v-text-field
							label="Name"
							outlined
							v-model="actualUser.name"
						></v-text-field>
					</v-col>
					<v-col cols="12" sm="6">
						<v-text-field
							label="Email"
							outlined
							v-model="actualUser.email"
						></v-text-field>
					</v-col>
					<v-col cols="12" sm="6">
						<v-text-field
							label="Username"
							outlined
							v-model="actualUser.username"
						></v-text-field>
					</v-col>
					<v-col cols="12" sm="6">
						<v-text-field
							type="password"
							label="Password"
							outlined
							v-model="actualUser.password"
						></v-text-field>
					</v-col>
				</v-row>
			</v-container>
			<v-card-actions class="mx-3">
				<v-row class="justify-sm-space-around">
					<v-btn color="success" @click="save" class="mx-1">{{
						itemEditing ? "save" : "add"
					}}</v-btn>
					<v-btn color="red lighten-1" @click="cancel" class="mx-1"
						>Cancel</v-btn
					>
				</v-row>
			</v-card-actions>
		</v-card>
		<v-data-table
			:headers="headers"
			:items="users"
			sort-by="_id"
			class="elevation-1"
		>
			<template v-slot:top>
				<v-toolbar flat color="white">
					<v-toolbar-title>Users Control</v-toolbar-title>
					<v-divider class="mx-4" inset vertical></v-divider>
					<v-spacer></v-spacer>
					<v-btn color="primary" @click="form" v-if="!formVisible"
						>Add New User</v-btn
					>
				</v-toolbar>
			</template>

			<template v-slot:item.actions="{ item }">
				<v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
				<v-icon small @click="activate(item)"
					>mdi-{{ item.active ? "cancel" : "check-bold" }}</v-icon
				>
			</template>

			<template v-slot:no-data>
				<v-row class="justify-center">
					<v-subheader>No one bill</v-subheader>
				</v-row>
			</template>
		</v-data-table>
	</div>
</template>

<script>
import userHttp from "../util/UserHttpUtil";
export default {
	data: () => ({
		headers: [
			{
				text: "Name",
				value: "name",
			},
			{
				text: "Email",
				value: "email",
			},
			{
				text: "Username",
				value: "username",
			},
			{
				text: "Actions",
				value: "actions",
				sortable: false,
			},
		],
		users: [],
		actions: "",
		itemEditing: false,
		actualUser: {},
		formVisible: false,
	}),

	computed: {
		formTitle() {
			return this.itemEditing ? "Edit User" : "New User";
		},
	},

	created() {
		this.initialize();
	},

	methods: {
		initialize() {
			this.listAll();
		},
		listAll() {
			userHttp.listAll().then(users => {
				this.users = users.data;
			});
		},
		form() {
			this.formVisible = true;
		},
		activate(user) {
			user.active = !user.active;
			this.save(user);
		},
		save(user) {
			let userCopy =
				user && user._id ? user : Object.assign({}, this.actualUser);
			if (!userCopy._id) {
				userCopy.active = true;
				userHttp.add(userCopy).then(res => {
					if (res.status === 200) this.listAll();
				});
			} else {
				userCopy.id = userCopy._id;
				userHttp.edit(userCopy).then(res => {
					if (res.status === 200) this.listAll();
				});
			}
			this.cancel();
		},
		editItem(user) {
			this.itemEditing = true;
			Object.assign(this.actualUser, user);
			this.formVisible = true;
		},
		cancel() {
			this.actualUser = {};
			this.itemEditing = false;
			this.formVisible = false;
		},
	},
};
</script>

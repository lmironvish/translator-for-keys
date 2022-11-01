<template>
    <div class="user-educations-table">
        <user-table-navigation
            :user-id="userId"
            :target-user-role="targetUserRole"
            @setNavigationData="setNavigationData"
            education
        />
        <user-kpis-table
            v-if="currentTable === 'kpis'"
            :user-id="userId"
            :target-user-ids="subordinates"
        />
        <user-seminars-table
            v-if="currentTable === 'seminars'"
            :user-id="userId"
            :target-user-ids="subordinates"
        />
        <user-trainings-table
            v-if="currentTable === 'trainings' && currentTab === 'trainings'"
            :user-id="userId"
            :target-user-ids="subordinates"
        />
        <user-trainings-participants-table
            v-if="
                currentTable === 'trainings' && currentTab === 'participation'
            "
            :user-id="userId"
            :target-user-ids="subordinates"
        />
        <user-trainings-teaching-table
            v-if="currentTable === 'trainings' && currentTab === 'teaching'"
            :user-id="userId"
            :target-user-ids="subordinates"
        />
        <user-club-table
            v-if="['club', 'loyalty'].includes(currentTable)"
            :user-id="userId"
            :brand="currentTable"
            :target-user-ids="subordinates"
        />
        <user-zakb-table
            v-if="currentTable === 'zakb'"
            :user-id="userId"
            :target-user-ids="subordinates"
            :brand="currentTab ? currentTab : undefined"
        />
    </div>
</template>

<script>
import UserTableNavigation from "@/blocks/user-table-navigation/user-table-navigation";

import UserTrainingsTable from "@/blocks/user-trainings-table/user-trainings-table";
import UserTrainingsParticipantsTable from "@/blocks/user-trainings-participants-table/user-trainings-participants-table";
import UserTrainingsTeachingTable from "@/blocks/user-trainings-teaching-table/user-trainings-teaching-table";
import UserKpisTable from "@/blocks/user-kpis-table/user-kpis-table";
import UserSeminarsTable from "@/blocks/user-seminars-table/user-seminars-table";
import UserClubTable from "@/blocks/user-club-table/user-club-table";
import UserZakbTable from "@/blocks/user-zakb-table/user-zakb-table";

export default {
    components: {
        UserZakbTable,
        UserTrainingsTable,
        UserTrainingsParticipantsTable,
        UserTrainingsTeachingTable,
        UserTableNavigation,
        UserKpisTable,
        UserSeminarsTable,
        UserClubTable
    },
    props: {
        userId: {
            type: Number,
            required: true
        },
        targetUserRole: {
            type: String,
            required: true
        }
    },
    data: () => ({
        currentTable: "",
        currentTab: "",
        subordinates: []
    }),
    computed: {
        salesQueryParams() {
            return {
                id: this.userId,
                filter: {
                    brand: this.currentTab ? this.currentTab : undefined,
                    targetUserIds: this.subordinates
                        ? this.subordinates
                        : undefined
                }
            };
        }
    },
    methods: {
        setNavigationData({ table, tab, subordinates }) {
            if (table && this.currentTable !== table) {
                this.currentTable = table;
            }
            if (this.currentTab !== tab) {
                this.currentTab = tab;
            }
            if (this.subordinates !== subordinates) {
                this.subordinates = subordinates;
            }
        }
    }
};
</script>

<style src="./user-educations-card-table.less" lang="less" />

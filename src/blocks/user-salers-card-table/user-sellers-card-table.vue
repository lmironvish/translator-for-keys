<template>
    <div class="user-sales-table">
        <user-table-navigation
            :user-id="userId"
            :target-user-role="targetUserRole"
            @setNavigationData="setNavigationData"
        />
        <user-clients-table
            v-if="currentTable === 'clients'"
            :user-id="userId"
            :target-user-ids="subordinates"
            :user-role="targetUserRole"
        />
        <user-sales-table
            v-if="currentTable === 'sales'"
            :user-id="userId"
            :target-user-ids="subordinates"
            :brand="currentTab ? currentTab : undefined"
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
        <user-registrations-table
            v-if="currentTable === 'registrations'"
            :user-id="userId"
            :target-user-ids="subordinates"
        />
        <user-zakb-table
            v-if="currentTable === 'zakb'"
            :user-id="userId"
            :target-user-ids="subordinates"
            :brand="currentTab ? currentTab : undefined"
        />
        <user-zakb-skp-proportion-table
            v-if="currentTable === 'skpZakbPart'"
            :user-id="userId"
            :target-user-ids="subordinates"
        />
    </div>
</template>

<script>
import UserTableNavigation from "@/blocks/user-table-navigation/user-table-navigation";
import UserSalesTable from "@/blocks/user-sales-table/user-sales-table";
import UserClientsTable from "@/blocks/user-clients-table/user-clients-table";
import UserTrainingsTable from "@/blocks/user-trainings-table/user-trainings-table";
import UserTrainingsParticipantsTable from "@/blocks/user-trainings-participants-table/user-trainings-participants-table";
import UserTrainingsTeachingTable from "@/blocks/user-trainings-teaching-table/user-trainings-teaching-table";
import UserClubTable from "@/blocks/user-club-table/user-club-table";
import UserRegistrationsTable from "@/blocks/user-registrations-table/user-registrations-table";
import UserZakbTable from "@/blocks/user-zakb-table/user-zakb-table";
import UserZakbSkpProportionTable from "@/blocks/user-zakb-skp-proportion-table/user-zakb-skp-proportion-table";

export default {
    components: {
        UserZakbSkpProportionTable,
        UserZakbTable,
        UserRegistrationsTable,
        UserClubTable,
        UserTrainingsTeachingTable,
        UserTrainingsParticipantsTable,
        UserTrainingsTable,
        UserClientsTable,
        UserSalesTable,
        UserTableNavigation
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

<style src="./user-sellers-card-table.less" lang="less" />

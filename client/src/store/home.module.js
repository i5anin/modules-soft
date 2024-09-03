import { defineStore } from "pinia";

export const useHomeStore = defineStore('home', {
    state: () => ({
        title: 'some title',
        Form: {
            title: '',
            description: ''
        },
        // Состояние для пагинации
        currentPage: 1,
        itemsPerPage: 15,
        searchQuery: '',
    }),
    actions: {
        add() {
            console.log(this.Form);
        },
        // Действия для пагинации
        nextPage() {
            this.currentPage++;
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        setSearchQuery(query) {
            this.searchQuery = query;
        }
    },
});
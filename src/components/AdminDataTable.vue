// AdminDataTable.vue (Renombrado conceptualmente a AdminLinksManager)

<template>
  <v-card elevation="4" rounded="lg" class="mb-5">
    <v-card-text>
      
      <v-alert v-if="alertMessage" :type="alertType.includes('success') ? 'success' : (alertType.includes('danger') ? 'error' : 'info')" variant="tonal" class="mb-4" closable @click:close="clearAlert">
        {{ alertMessage }}
      </v-alert>

      <v-row align="end" class="mb-4">
        <v-col cols="12" sm="6" md="5" lg="6">
          <v-text-field 
            v-model="searchTerm" 
            label="Búsqueda por Nombre, Símbolo o Descripción" 
            density="compact"
            hide-details
            clearable
            variant="outlined"
          >
            <template v-slot:prepend-inner>
              <v-icon>mdi-magnify</v-icon>
            </template>
          </v-text-field>
        </v-col>
        
        <v-col cols="12" sm="6" md="4" lg="3">
          <v-select 
            v-model="filterStatus" 
            :items="statusItems" 
            item-title="text" 
            item-value="value" 
            label="Filtrar por Estado" 
            density="compact"
            hide-details
            variant="outlined"
          />
        </v-col>
        
        <v-col cols="12" md="3" lg="3" class="text-md-right">
          <v-btn color="primary" @click="openAddModal" block prepend-icon="mdi-plus">
            Agregar Nuevo Enlace
          </v-btn>
        </v-col>
      </v-row>

      <v-table class="align-middle rounded-lg elevation-1">
        <thead>
          <tr>
            <th class="text-left">ID</th>
            <th class="text-left">Nombre</th>
            <th class="text-left">Símbolo</th>
            <th class="text-left">URL de Compra</th>
            <th class="text-left">Estado</th>
            <th class="text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="link in filteredLinks" :key="link.id">
            <td>{{ link.id }}</td>
            <td class="font-weight-medium">{{ link.nombre }}</td>
            <td>{{ link.simbolo }}</td>
            <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis;">
              <a :href="link.url_compra" target="_blank">{{ link.url_compra.substring(0, 30) }}...</a>
            </td>
            <td>
              <v-chip :color="link.activo ? 'success' : 'error'" label size="small">{{ link.activo ? 'Activo' : 'Inactivo' }}</v-chip>
            </td>
            <td class="text-right">
              <v-btn variant="text" color="primary" size="small" class="mr-1" @click="editLinkRedirect(link)" icon="mdi-pencil"></v-btn>
              <v-btn variant="text" color="error" size="small" @click="confirmDeleteLink(link)" icon="mdi-delete"></v-btn>
            </td>
          </tr>
          <tr v-if="filteredLinks.length === 0">
            <td colspan="6" class="text-center text-caption py-4">
              No se encontraron enlaces con los filtros aplicados.
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-dialog v-model="addModalOpen" max-width="900" persistent>
        <v-card rounded="lg">
          <v-card-title class="bg-primary text-white d-flex align-center justify-space-between">
            <span>Agregar Nuevo Enlace Cripto</span>
            <v-btn icon="mdi-close" variant="text" color="white" @click="closeAddModal"></v-btn>
          </v-card-title>
          
          <v-card-text class="pa-5">
            <v-form @submit.prevent="addLinkWithConfirmation">
              <v-row dense>
                
                <v-col cols="12" md="4">
                  <v-text-field label="Nombre (Bitcoin)" v-model="newLink.nombre" required variant="outlined" density="comfortable" />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field label="Símbolo (BTC)" v-model="newLink.simbolo" required variant="outlined" density="comfortable" />
                </v-col>
                <v-col cols="12" md="4">
                  <v-select label="Activo" v-model="newLink.activo" :items="[true, false]" required variant="outlined" density="comfortable" />
                </v-col>

                <v-col cols="12">
                  <v-text-field label="URL de Compra (https://...)" v-model="newLink.url_compra" required variant="outlined" density="comfortable" />
                </v-col>
                <v-col cols="12">
                  <v-text-field label="URL de Imagen" v-model="newLink.url_imagen" required variant="outlined" density="comfortable" />
                </v-col>

                <v-col cols="12">
                  <v-textarea label="Descripción" v-model="newLink.descripcion" rows="3" required variant="outlined" density="comfortable" />
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          
          <v-divider />

          <v-card-actions class="pa-4">
            <v-spacer />
            <v-btn color="secondary" variant="text" @click="closeAddModal">Cancelar</v-btn>
            <v-btn color="primary" @click="addLinkWithConfirmation" prepend-icon="mdi-plus" :disabled="!isNewLinkValid">Agregar Enlace</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      
      </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'pinia';
// ADAPTACIÓN: Importar useDataStore
import { useDataStore } from '@/stores/dataStore'; 

export default {
  name: 'AdminLinksManager', // Nombre adaptado
  
  data() {
    return {
      searchTerm: '',
      filterStatus: '',
      statuses: [true, false], 
      // ADAPTACIÓN: Estructura de datos para nuevos enlaces
      newLink: { 
        nombre: '', simbolo: '', url_compra: '', descripcion: '', url_imagen: '', activo: true
      },
      addModalOpen: false,
      alertMessage: '',
      alertType: '',
    }
  },
  
  computed: {
    // ADAPTACIÓN: Se cambia useCoursesStore por useDataStore y allCourses por allLinks
    ...mapState(useDataStore, {
      allLinks: 'getLinks',
    }),
    
    // Lista de ítems para el v-select de estado
    statusItems() {
      return [
        { text: 'Todos', value: '' },
        { text: 'Activo', value: true },
        { text: 'Inactivo', value: false },
      ];
    },

    // Validación simple
    isNewLinkValid() {
      // ADAPTACIÓN: Validar campos de enlace
      return this.newLink.nombre && this.newLink.simbolo && this.newLink.url_compra && this.newLink.descripcion;
    },

    filteredLinks() {
      return this.allLinks.filter(link => {
        const matchesSearch = this.searchTerm 
          ? [link.nombre, link.simbolo, link.descripcion].some(field => 
              field && String(field).toLowerCase().includes(this.searchTerm.toLowerCase())
            ) 
          : true;
        
        // ADAPTACIÓN: Filtrar por la propiedad 'activo'
        const matchesStatus = this.filterStatus !== ''
          ? link.activo === this.filterStatus 
          : true;

        return matchesSearch && matchesStatus;
      });
    }
  },
  
  methods: {
    // ADAPTACIÓN: Se cambian las acciones a addLink y deleteLink
    ...mapActions(useDataStore, ['addLink', 'deleteLink']),

    showAlert(message, type = 'alert-success') {
      this.alertMessage = message;
      this.alertType = type;
      setTimeout(() => this.clearAlert(), 5000);
    },
    clearAlert() {
      this.alertMessage = '';
      this.alertType = '';
    },

    openAddModal() {
      this.clearAlert();
      // Resetear el formulario al abrir con valores por defecto
      this.newLink = { nombre: '', simbolo: '', url_compra: '', descripcion: '', url_imagen: '', activo: true };
      this.addModalOpen = true;
    },
    closeAddModal() {
      this.addModalOpen = false;
    },

    async addLinkWithConfirmation() {
      if (!this.isNewLinkValid) {
        this.showAlert('❌ Por favor, complete todos los campos requeridos.', 'alert-danger');
        return;
      }
      
      const confirmAdd = window.confirm(`¿Desea agregar el enlace "${this.newLink.nombre}" (Símbolo: ${this.newLink.simbolo}) a la base de datos?`);

      if (confirmAdd) {
        const linkData = {
          // ADAPTACIÓN: Mapeo de datos al schema de Firestore
          nombre: this.newLink.nombre.trim(),
          simbolo: this.newLink.simbolo.trim(),
          url_compra: this.newLink.url_compra.trim(),
          descripcion: this.newLink.descripcion.trim(),
          url_imagen: this.newLink.url_imagen.trim(),
          activo: this.newLink.activo,
        };
        
        const result = await this.addLink(linkData);
        
        if (result.success) {
          this.closeAddModal();
          this.showAlert(`✅ Enlace "${this.newLink.nombre}" agregado correctamente.`, 'alert-success');
        } else {
          this.showAlert(`❌ Error al agregar enlace: ${result.error}`, 'alert-danger');
        }
      }
    },

    editLinkRedirect(link) {
      // ADAPTACIÓN: Se cambia el nombre de la ruta a 'EditarCripto'
      this.$router.push({ name: 'EditarCripto', params: { id: link.id } });
    },

    async confirmDeleteLink(link) {
      this.clearAlert();
      
      const confirmDelete = window.confirm(`⚠️ ¿Desea realmente eliminar el enlace de "${link.nombre}"? Esta acción es irreversible.`);
      
      if (confirmDelete) {
        // ADAPTACIÓN: Llamada a deleteLink
        const result = await this.deleteLink(link.id);
        
        if (result.success) {
          this.showAlert(`✅ Enlace "${link.nombre}" eliminado correctamente.`, 'alert-success');
        } else {
          this.showAlert(`❌ Error al eliminar enlace: ${result.error}`, 'alert-danger');
        }
      }
    }
  },

};
</script>

<style scoped>
/* Estilos adaptados */
</style>
<template>
  <div>
    <q-select
      filled
      v-model="model"
      use-input
      use-chips
      :multiple="multipleselect"
      dense
      outlined
      input-debounce="0"
      :label="type"
      @new-value="createValue"
      :options="filterOptions"
      @filter="filterFn"
      style="width: 250px"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">No results</q-item-section>
        </q-item>
      </template>
      <template v-slot:append>
        <q-icon
          v-if="model !== null"
          class="cursor-pointer"
          name="clear"
          @click.stop="model = null"
        ></q-icon>
      </template>
    </q-select>
  </div>
</template>

<script>
export default {
  name: "FilterSelect",
  props: ["stringOptions", "type", "multipleselect"],
  data() {
    return {
      model: [],
      filterOptions: this.stringOptions
    };
  },
  computed: {},
  methods: {
    emitModel() {
      // this.$emit("selectEmit", this.model);
      return this.model;
    },
    createValue(val, done) {
      // Calling done(var) when new-value-mode is not set or "add", or done(var, "add") adds "var" content to the model
      // and it resets the input textbox to empty string
      // ----
      // Calling done(var) when new-value-mode is "add-unique", or done(var, "add-unique") adds "var" content to the model
      // only if is not already set
      // and it resets the input textbox to empty string
      // ----
      // Calling done(var) when new-value-mode is "toggle", or done(var, "toggle") toggles the model with "var" content
      // (adds to model if not already in the model, removes from model if already has it)
      // and it resets the input textbox to empty string
      // ----
      // If "var" content is undefined/null, then it doesn't tampers with the model
      // and only resets the input textbox to empty string

      if (val.length > 0) {
        if (!this.stringOptions.includes(val)) {
          this.stringOptions.push(val);
        }
        done(val, "toggle");
      }
    },
    filterFn(val, update) {
      update(() => {
        if (val === "") {
          this.filterOptions = this.stringOptions;
        } else {
          const needle = val.toLowerCase();
          this.filterOptions = this.stringOptions.filter(
            v => v.toLowerCase().indexOf(needle) > -1
          );
        }
      });
    }
  }
};
</script>
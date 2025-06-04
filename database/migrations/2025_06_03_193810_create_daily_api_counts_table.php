<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('daily_api_counts', function (Blueprint $table) {
            $table->id();
            $table->string('service_name'); // e.g., 'omdb', 'gemini', 'youtube'
            $table->date('date');
            $table->unsignedInteger('count')->default(0);
            $table->timestamps();

            $table->unique(['service_name', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_api_counts');
    }
};
